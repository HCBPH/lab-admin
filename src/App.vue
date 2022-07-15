<template>
  <div class="layout">
    <el-container v-if="state.showMenu" class="container">
      <el-aside class="aside">
        <div class="head">
          <div>
            <img src="@/assets/L.png" alt="logo">
            <span>Life研究所</span>
          </div>
        </div>
        <div class="line" />
        <el-menu
          :default-openeds="state.defaultOpen"
          background-color="#222832"
          text-color="#fff"
          :router="true"
          :default-active='state.currentPath'
        >
          <el-menu-item index="/">
            <template #title>
              <span>首页</span>
            </template>
          </el-menu-item>
          <el-submenu index="4">
            <template #title>
              <span>用户管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/user"><i class="el-icon-menu" />用户信息</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="1">
            <template #title>
              <span>投诉管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/accuse"><i class="el-icon-menu" />投诉信息</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template #title>
              <span>推荐管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/recommend"><i class="el-icon-picture" />推荐信息</el-menu-item>
              <el-menu-item index="/recommend_add"><i class="el-icon-picture" />上传推荐</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3">
            <template #title>
              <span>店铺管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/shop_info"><i class="el-icon-menu" />店铺信息</el-menu-item>
              <el-menu-item index="/shop_add"><i class="el-icon-menu" />上传店铺</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          
          
        </el-menu>
      </el-aside>
      <el-container class="content">
        <Header />
        <div class="main">
          <router-view />
        </div>
        <Footer />
      </el-container>
    </el-container>
    <el-container v-else class="container">
      <router-view />
    </el-container>
  </div>
</template>

<script>
import { onUnmounted, reactive } from 'vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { useRouter } from 'vue-router'
import { pathMap, localGet } from '@/utils'
export default {
  name: 'App',
  components: {
    Header,
    Footer
  },
  setup() {
    console.log('App')
    const noMenu = ['/login']
    const router = useRouter()
    const state = reactive({
      defaultOpen: ['1', '2', '3', '4'],
      showMenu: true,
      currentPath: '/dashboard',
      count: {
        number: 1
      }
    })
    // 监听浏览器原生回退事件
    if (window.history && window.history.pushState) {
      history.pushState(null, null, document.URL);
      window.addEventListener('popstate', () => {
        if (!localGet('token')) {
          state.showMenu = false
        }
      }, false);
    }
    const unwatch = router.beforeEach((to, from, next) => {
      if (to.path == '/login') {
        // 如果路径是 /login 则正常执行
        next()
      } else {
        // 如果不是 /login，判断是否有 token
        if (!localGet('token')) {
          // 如果没有，则跳至登录页面
          next({ path: '/login' })
        } else {
          // 否则继续执行
          next()
        }
      }
      state.showMenu = !noMenu.includes(to.path)
      state.currentPath = to.path
      document.title = pathMap[to.name]
    })

    onUnmounted(() => {
      unwatch()
    })

    return {
      state
    }
  }
}
</script>

<style scoped>
  .layout {
    min-height: 100vh;
    background-color: #ffffff;
  }
  .container {
    height: 100vh;
  }
  .aside {
    width: 200px!important;
    background-color: #222832;
    overflow: hidden;
    overflow-y: auto;
    -ms-overflow-style: none;
    overflow: -moz-scrollbars-none;
  }
  .aside::-webkit-scrollbar {
    display: none;
  }
  .head {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
  }
  .head > div {
    display: flex;
    align-items: center;
  }

  .head img {
    width: 50px;
    height: 50px;
    margin-right: 10px;
  }
  .head span {
    font-size: 20px;
    color: #ffffff;
  }
  .line {
    border-top: 1px solid hsla(0,0%,100%,.05);
    border-bottom: 1px solid rgba(0,0,0,.2);
  }
  .content {
    display: flex;
    flex-direction: column;
    max-height: 100vh;
    overflow: hidden;
  }
  .main {
    height: calc(100vh - 100px);
    overflow: auto;
    padding: 10px;
  }
</style>
<style>
  body {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }
  .el-menu {
    border-right: none!important;
  }
  .el-submenu {
    border-top: 1px solid hsla(0, 0%, 100%, .05);
    border-bottom: 1px solid rgba(0, 0, 0, .2);
  }
  .el-submenu:first-child {
    border-top: none;
  }
  .el-submenu [class^="el-icon-"] {
    vertical-align: -1px!important;
  }
  a {
    color: #409eff;
    text-decoration: none;
  }
  .el-pagination {
    text-align: center;
    margin-top: 20px;
  }
  .el-popper__arrow {
    display: none;
  }
</style>
