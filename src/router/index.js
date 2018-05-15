import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main'
import Form from '@/components/Form'
import Login from '@/components/Login'
import axios from 'axios';

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      component: Login
    },{
      path: '/main',
      component: Main,
    },{
      path: '/main/add',
      component: Form,
    },{
      path: '/main/page/:pageIndex',
      component: Main,
    }]
})

router.beforeEach((to, from, next) => {
    axios.get('/api/login/check').then(resp => {
        resp = resp.data;
        if(!resp.status){
            if(to.fullPath.indexOf("/main") == 0){ 
                next('/');
            }else{
                next();
            }   
        }else{
            if(to.fullPath.indexOf("/main") == 0){ 
                next();
            }else{
                next('/main');
            }   
        }   
    }).catch(err => {
        throw err;          
    }); 
});

export default router;
