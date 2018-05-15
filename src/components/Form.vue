<style>

</style>

<template>
<el-card>
    <div slot="header" class="card-title">{{pageTitle}}</div>
    <el-form style="text-align:left;" label-width="150px">
        <el-form-item label="目的地">
            <el-input style="width:450px;" v-model="dest"></el-input>
        </el-form-item>
        <el-form-item label="团期">
            <el-input style="width:450px;" v-model="period"></el-input>
        </el-form-item>
        <el-form-item label="天数">
            <el-input style="width:450px;" v-model="days"></el-input>
        </el-form-item>
        <el-form-item label="去程航班">
            <el-input style="width:450px;" v-model="comeFlight"></el-input>
        </el-form-item>
        <el-form-item label="回程航班">
            <el-input style="width:450px;" v-model="backFlight"></el-input>
        </el-form-item>
        <el-form-item label="单机票">
            <el-input style="width:450px;" v-model="price"></el-input>
        </el-form-item>
        <el-form-item label="余位">
            <el-input style="width:450px;" v-model="number"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit">保存</el-button>
            <el-button @click="back">取消</el-button>
        </el-form-item>
    </el-form>
</el-card>

</template>

<script>
    import Vue from 'vue';
    import {Form, FormItem, Input, Message} from 'element-ui';
    import axios from 'axios';

    Vue.use(Form);
    Vue.use(FormItem);
    Vue.use(Input);

    Vue.prototype.$msgbox = Message;

	export default {
		data () {
			return {
                pageTitle: '添加机票',
                dest:'',
                period:'',
                days:'',
                comeFlight:'',
                backFlight:'',
                price: '',
                number: '',
            };	
		},
		methods: {
		    onSubmit () {
                let fields = ['dest', 'period', 'days', 'comeFlight', 'backFlight', 'price', 'number'];
                let fieldNames = ['目的地', '团期', '天数', '去程航班', '回程航班', '单机票', '余位'];
                for(let i=0; i<fields.length; i++){
                    if(this[fields[i]] == ''){
                        this.$msgbox({
                            type: 'error',
                            message: fieldNames[i] + '不能为空'
                        });
                        return;
                    }
                }

                let data = {
                    dest: this.dest,
                    period: this.period,
                    days: this.days,
                    comeFlight: this.comeFlight,
                    backFlight: this.backFlight,
                    price: this.price,
                    number: this.number,
                };

                axios.post('/api/add', data).then(resp => {
                    resp = resp.data;
                    if(!resp.status){
                        this.$msgbox({
                            type: 'error',
                            message: resp.message
                        });
                        return;
                    }

                    this.$router.push('/');

                }).catch(err => {
                    this.$msgbox({
                        type: 'error',
                        message: err.message
                    });
                });
            },
            back () {
                this.$router.go(-1);
            }
		}
	};
   
</script>
