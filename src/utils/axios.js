import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router/index'
import { localGet } from './index'
import config from '~/config'


// 这边由于后端没有区分测试和正式，姑且都写成一个接口。
axios.defaults.baseURL = config[import.meta.env.MODE].baseUrl
// 携带 cookie，对目前的项目没有什么作用，因为我们是 token 鉴权
axios.defaults.withCredentials = true
// 请求头，headers 信息
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers['token'] = localGet('token') || ''
// 默认 post 请求，使用 application/json 形式
axios.defaults.headers.post['Content-Type'] = 'application/json'

// 请求拦截器，内部根据返回值，重新组装，统一管理。
axios.interceptors.response.use(res => {
  // console.log(typeof res.data)
  if (res.data.code === 2000) {
    return Promise.resolve(res.data)
 }
  if (typeof res.data !== 'object') {
    ElMessage.error('服务端异常！')
    return Promise.reject(res)
  }
  if (res.data.code != 2000) {
    if (res.data.message) ElMessage.error(res.data.message)
    if (res.data.code == 419) {
      router.push({ path: '/login' })
    }
    return Promise.reject(res.data)
  }
  return res.data
    // if (res.data.code == 20000) {
    // // code值为 0 或 200 时视为成功
    //    return Promise.resolve(res);
    // }
    // return Promise.reject(res);
    // }, err => {
    // // 在请求错误时要做的事儿
    //     ElMessage.error('服务端异常！');
    // // 此处返回的数据是axios.catch(err)中接收的数据
    //     return Promise.reject(err);
})

export default axios