import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(), // hash模式：createWebHashHistory，history模式：createWebHistory
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import(/* webpackChunkName: "dashboard" */ '../views/Index.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
    },
    {
      path: '/account',
      name: 'account',
      component: () => import(/* webpackChunkName: "account" */ '../views/Account.vue')
    },
    {
      path: '/shop_info',
      name: 'shop_info',
      component: () => import(/* webpackChunkName: "account" */ '../views/shop/shopInfo.vue')
    },
    {
      path: '/shop_add',
      name: 'shop_add',
      component: () => import(/* webpackChunkName: "account" */ '../views/shop/upload-shopInfo1.vue')
    },
    {
      path: '/recommend_add',
      name: 'recommend_add',
      component: () => import(/* webpackChunkName: "account" */ '../views/recommend/upload-recommendInfo1.vue')
    },
    {
      path: '/user',
      name: 'user',
      component: () => import(/* webpackChunkName: "user" */ '../views/User.vue')
    },
    {
      path: '/accuse',
      name: 'accuse',
      component: () => import(/* webpackChunkName: "accuse" */ '../views/Accuse.vue')
    },
    {
      path: '/recommend',
      name: 'recommend',
      component: () => import(/* webpackChunkName: "recommend" */ '../views/Recommend.vue')
    },
    {
      path: '/recommendDetail',
      name: 'recommendDetail',
      component: () => import(/* webpackChunkName: "recommendDetail" */ '../views/RecommendDetail.vue')
    }
  ]
})

export default router