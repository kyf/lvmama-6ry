<template>
  <div>
      <div style="display:flex;flex-flow:row; justify-content:space-between;width:100%;">
          <el-input placeholder="请输入目的地关键字..." v-model="searchkey" style="width:320px;">
              <el-button slot="append" @click="load(1)" icon="el-icon-search"></el-button>
          </el-input>
          <div>
            <el-button type="primary" @click="add">添加</el-button>
            <el-button @click="exit">退出</el-button>
          </div>
      </div>
      {{error}}
      <el-card style="margin-top:15px;">
          <el-table :data="list">
            <el-table-column prop="dest" label="目的地"/>              
            <el-table-column prop="period" label="团期"/>              
            <el-table-column prop="days" label="天数" width="80"/>              
            <el-table-column prop="comeFlight" label="去程航班"/>              
            <el-table-column prop="backFlight" label="回程航班"/>              
            <el-table-column prop="price" width="100" label="单机票"/>              
            <el-table-column prop="number" width="100" label="余位"/>              
            <el-table-column label="操作">
                <template slot-scope="data">
                    <el-button type="text" @click="del(data.row._id)">删除</el-button>
                    <el-button type="text" @click="update(data.row._id, data.row.number)">更新余位</el-button>
                </template>
            </el-table-column>
          </el-table>

          <div style="text-align:right;margin-top:25px;">
            <el-pagination background :current-page="pageIndex" @current-change="jump" layout="prev, pager, next" :total="total" :page-size="pageSize"></el-pagination>
          </div>
      </el-card>
  </div>
</template>

<script>
import Vue from 'vue';
import {Button, Card, Table, TableColumn, Pagination, Message, MessageBox} from 'element-ui';
import axios from 'axios';

Vue.use(Button);
Vue.use(Card);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Pagination);


export default {
  name: 'Main',
  data () {
    return {
        list: [],
        pageIndex: 1,
        pageSize: 10,
        error: '',
        total: 0,
        searchkey: '',
    }
  },
  watch: {
    '$route' (to, from) {
        this.load(parseInt(to.params.pageIndex));
    }
  },
  mounted () {
    let pageIndex = this.$route.params['pageIndex'];
    if(!pageIndex)pageIndex = 1;
    this.load(parseInt(pageIndex));
  },
  methods: {
    jump (index) {
        this.$router.push('/main/page/' + index);
    },
    load (index) {
        let data = {
            pageIndex: index,
            pageSize: this.pageSize,
            searchkey: this.searchkey,
        };
        axios.post('/api/list', data).then(resp => {
            resp = resp.data;
            if(!resp.status){
                this.error = resp.message;
                return;
            }

            this.list = resp.data;
            this.total = resp.total;
            this.pageIndex = index;
        }).catch(err => {
            this.error = err.message;    
        });
   
    },
    add () {
        this.$router.push('/main/add');
    },
    update (id, number) {
        MessageBox.prompt('请输入余位数', '提示', {
            inputPattern: /^[\d]+$/,
            inputValue: number,
            inputErrorMessage: '余位只能是数字'
        }).then(value => {
            axios.post('/api/update/'+id, {number: value.value}).then(resp => {
                resp = resp.data;
                if(!resp.status){
                    Message({
                        type: 'error',
                        message: err.message
                    });    
                    return;
                }

                this.load(this.pageIndex);
            }).catch(err => {
                Message({
                    type: 'error',
                    message: err.message
                });    
            });
        }).catch(err => {
        });
    },
    del (id) {
        let self = this;
        MessageBox.confirm('确认删除该数据吗？', '提示', {
            callback (e) {
                if(e == 'confirm'){
                    axios.get('/api/delete/' + id).then(resp => {
                        resp = resp.data;
                        if(!resp.status){
                            Message({
                                type: 'error',
                                message: resp.message
                            });    
                            return;
                        }

                        self.load(self.pageIndex);
                    }).catch(err => {
                        Message({
                            type: 'error',
                            message: err.message
                        });    
                    });
                }
            }
        });
    },
    exit () {
        axios.get('/api/logout').then(resp => {
            resp = resp.data;
            if(!resp.status){
                Message({
                    type: 'error',
                    message: err.message
                });    
                return;
            }

            this.$router.push('/');
        }).catch(err => {
            Message({
                type: 'error',
                message: err.message
            });    
        });
    }
  }
}
</script>

<style scoped>
</style>
