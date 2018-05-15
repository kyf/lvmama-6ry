<template>
    <div class="body">
        <div class="cloudbg">
          <div class="login">
            <div class="bg"></div>
            <div class="login-form">
                <div class="title">
                    <img src="../assets/cover.png">
                </div>
                <div class="form-item">
                    <div class="label">用户名</div>
                    <el-input type="text" placeholder="请输入用户名..." v-model.trim="username" />
                </div>
                <div class="form-item">
                    <div class="label">密码</div>
                    <el-input type="password" placeholder="请输入密码..." v-model.trim="password"/>
                </div>
                <el-button type="primary" :loading="isloading" @click="submit" style="width:100%;margin-top:30px;">
                    登录
                </el-button>
            </div>
          </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import {Button, Input, MessageBox} from 'element-ui';
import axios from 'axios';

Vue.use(Button);
Vue.use(Input);

Vue.prototype.$alert = MessageBox.alert;

export default {
  name: 'login',
  data () {
    return {
        isloading: false,
        username: '',
        password: '',
    }
  },
  methods: {
    submit(){
        if(this.username == ''  || this.password == ''){
            this.$alert('用户名或密码不能为空', '提示', {
                type: 'error',
            });
            return;
        }

        this.isloading = true;
        axios.post('/api/login', {username: this.username, password: this.password}).then(resp => {
            resp = resp.data;
            if(!resp.status){
                this.$alert(resp.message, '提示', {type: 'error'});
                this.isloading = false;
                return;
            }
            this.$router.push('/main');
        }).catch(err => {
            if(!resp.status){
                this.$alert(err.message, '提示', {type: 'error'});
                this.isloading = false;
                return;
            }
        });
    }
  },
}
</script>

<style scoped>
.body{
    background-color:#1c77ac; 
    background-image:url(../assets/light.png); 
    background-repeat:no-repeat; 
    background-position:center top; 
    overflow:hidden;
    position:absolute;
    left:0;
    right:0;
    top:0;
    bottom:0;
}
.login{
    width:430px;
    height:540px;
    margin:0 auto;
    position:relative;
    margin-top:30px;
}
.cloudbg{
    background-image:url(../assets/loginbg3.png); 
    background-repeat:no-repeat; 
    background-position:center top; 
    width:100%;
    height:585px;
    position:absolute;
    top:57px;
}
.login-form{
    background:transparent;
    padding:20px 60px;
    color:#1C77AC;
    position:absolute;
    top:0px;
    left:0px;
    right:0px;
    bottom:0px;
}
.title{
    font-size:40px;
    text-align:center;
    margin-top:60px;
}
.bg{
    position:absolute;
    top:0px;
    left:0px;
    right:0px;
    bottom:0px;
    background:white;
    opacity:.2;
    border-radius:8px;
}
.label{
    text-align:left;
    line-height:30px;
    color:#1C77AC;   
    font-size:14px;
}
.form-item{
    margin:25px 0px;
}
</style>
