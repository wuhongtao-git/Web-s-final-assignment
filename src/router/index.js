import Vue from 'vue'
import Router from 'vue-router'
import loginPage from '@/pages/loginPage'
import listPage from '@/pages/listPage'
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: loginPage
    },
    {
      path: '/list',
      name: 'list',
      component: listPage
    },
    {
      path: '/mylist',
      name: 'mylist',
      component: listPage
    },
    {
      path: '/collect',
      name: 'collect',
      component: listPage
    }
  ]
})
