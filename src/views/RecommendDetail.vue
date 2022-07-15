<template>
  <el-card class="order-container">
    

    <el-row>
      <el-col
        :span="24"
        style="padding:10px;"
      >
        <div>
          <el-card :body-style="{ padding: '0px' }" style="width:640px;margin:0px auto;">
            <div style="width:100%;height:300px;">
              <el-col :span="24">
                <img
                  :src="getUrl(i.cover)"
                  style="width:100%;height:300px;object-fit: cover;"
                />
              </el-col>
              <el-col
                :span="24"
                style="padding:20px"
              >
                <div align="center">
                  <span
                    style="font-size:28px;color:#303133">{{i.title}}</span><br />
                  
                </div>
                <div align="center" style="margin-top: 6px;">
                  <span
                    style="font-size:18px;color:#606266;margin-top: 4px;">{{i.brief}}</span>
                </div>
                <div style="margin-top:20px;margin-bottom:20px">
                  <hr style="color:#529b2e;"/>
                </div>
                <div v-for="i in textList.length" :key="i">
                  <div style="padding-left:10px;padding-right:10px;text-indent:2em;margin-top: 10px;">
                    {{textList[i-1]}}
                  </div>
                  <div align="center" style="padding-left:10px;padding-right:10px;text-indent:2em;margin-top: 10px;">
                    <img
                    v-if="imgList[i-1]!=null"
                  :src="getUrl(imgList[i-1])"
                  style="width:90%;object-fit: cover;"
                />
                  </div>
                </div>
                <br />
                <div style="margin-top:20px;margin-bottom:20px">
                  <hr style="color:#529b2e;"/>
                </div>
                <div align="center">
                  
                  <span
                    style="font-size:14px;color:#606266;">{{getTime(i.time)}}</span><br />
                  <span
                    style="font-size:14px;color:#606266;">{{i.publisher}}</span>
                  <br />
                  
                </div><br />
                
                <el-col :span="12">
                  <div style="margin-top: 8px;">
                    <span
                      style="font-size:14px;color:#606266;">ID：{{i.id}}</span>
                    
                  </div>
                </el-col>
                <el-col :span="12">
                  <div
                    align="end"
                    style="margin-top: 8px;"
                  >
                    <span style="font-size:14px;margin-left:20px;color:#606266;">状态：
                    <span
                      style="color: #529b2e;font-weight:bold"
                      v-if="i.is_delete==0"
                    >开启</span>
                    <span
                      style="color:#F56C6C;font-weight:bold"
                      v-if="i.is_delete==1"
                    >关闭</span>
                  </span>
                  </div>
                </el-col>
              </el-col>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>

  </el-card>
</template>

<script>
import { onMounted, reactive, ref, toRefs } from 'vue'
import { ElMessage, ElRow, ElCol } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'

import axios from 'axios'
//import { raw } from 'body-parser'
export default {
  name: 'RecommendDtail',
  components: {
    ElRow,
    ElCol
  },
  setup () {
     const router = useRouter()
    const route = useRoute()
    const state = reactive({
      loading: false,
      dialogVisible: false,
      rid: '13',
      tableData: [], // 数据列表
      multipleSelection: [], // 选中项
      total: 16, // 总条数
      currentPage: 1, // 当前页
      pageSize: 8, // 分页大小
      nowUsername: '',
      
      i:{
        id: 2,
        publisher: 'Life研究小组',
        cover: '20220714153525.jpg',
        title: '圣诞快乐！',
        brief: '感谢大家的支持与陪伴',
        content: '感谢大家的支持与陪伴感谢大家的支持与陪伴感谢大家的支持与陪伴',
        time: '2021-12-16T14:00:01.000Z',
        is_deleted: '0',
      },
      url: '20220714153525.jpg',
      textList:[],
      imgList:[]
    })
    onMounted(() => {
      state.rid = route.query.rid
      getRecommendList()
    })
    // 获取列表
    const getRecommendList = () => {
      state.loading = true
      axios.get('/recommend/FindOneRecommend', {
        params: {
          rid:state.rid
        }
      }).then(res => {
        if (res.code == 2000) {
          state.i = res.data
          getTextImg()
        } else {
          ElMessage.error('数据加载出错')
        }
        state.loading = false
      })
    }
    const getTextImg = () => {
      state.textList=state.i.content.split('@pic@')
      state.imgList=state.i.picture.split('&')
      console.log(state.textList)
      console.log(state.imgList)
    }
    const getUrl = (name) => {
      var picUrl = 'http://1.117.74.41:8080/templates/' + name
      return picUrl
    }
    const getTime = (time) => {
      var tmp = time.split('T')
      var ymd = tmp[0].split('-')
      var hm = tmp[1].split('.')[0].split(':')
      var newTime = ymd[0] + '.' + ymd[1] + '.' + ymd[2] + ' ' + hm[0] + ':' + hm[1]
      return newTime
    }
    const changeState = (id, state) => {
      var url = ""
      if (state == 0) {
        url += '/recommend/Delete'
      } else {
        url += '/recommend/Recover'
      }
      axios.get(url, {
        params: {
          rid: id
        }
      }).then(res => {
        if (res.code == 2000) {
          ElMessage({
            type: 'success',
            message: '操作成功'
          })
          getRecommendList()
        } else {
          ElMessage.error('操作成功')
        }
        state.loading = false
      })
      return newTime
    }

    const handleOption = () => {
      state.currentPage = 1
      getRecommendList()
    }
    // 选择项
    const handleSelectionChange = (val) => {
      state.multipleSelection = val
    }
    const changePage = (val) => {
      state.currentPage = val
      getRecommendList()
    }
    const handleConfig = (id) => {
      console.log('id', id)
      let params
      if (id) {
        params = [id]
      } else {
        if (!state.multipleSelection.length) {
          console.log('state.multipleSelection', state.multipleSelection.length)
          ElMessage.error('请选择项')
          return
        }
        params = state.multipleSelection.map(i => i.orderId)
      }
    }

    const filterTag = (value, row) => {
      return row.state === value
    }
    return {
      ...toRefs(state),
      handleSelectionChange,
      getRecommendList,
      changePage,
      handleOption,
      handleConfig,
      filterTag,
      getUrl,
      getTime,
      changeState,
      getTextImg
    }
  }
}
</script>

<style scoped>
.order-container {
  min-height: 100%;
}
.el-card.is-always-shadow {
  min-height: 100% !important;
}
</style>