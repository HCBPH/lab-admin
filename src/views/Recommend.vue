<template>
  <el-card class="order-container">
    <template #header>
      <div class="header">
        <el-input
          style="width: 200px; margin-right: 10px"
          placeholder="请输入ID"
          v-model="rid"
          size="small"
          clearable
        />

        <el-button
          type="primary"
          size="small"
          @click="findById()"
        >搜索</el-button>
      </div>
    </template>

    <el-row>
      <el-col
        :span="12"
        style="padding:10px;"
        v-for="i in listData"
        :key="i"
      >
        <div>
          <el-card style="width:600px;height:240px;margin:0px auto;">
            <div style="width:100%;height:200px;">
              <el-col :span="11">
                <img
                  :src="getUrl(i.cover)"
                  style="width:100%;height:200px;object-fit: cover;"
                />
              </el-col>
              <el-col
                :offset="1"
                :span="12"
              >
                <div>
                  <span
                    style="font-size:28px;color:#303133">{{i.title}}</span><br />
                  <span
                    style="font-size:18px;color:#606266;margin-top: 4px;">{{i.brief}}</span>
                </div>
                <div>
                  <br />
                  <span
                    style="font-size:14px;color:#606266;">发布时间：{{getTime(i.time)}}</span><br />
                  <span
                    style="font-size:14px;color:#606266;">发布人：{{i.publisher}}</span>
                  <br />
                  <span style="font-size:14px;color:#606266;">状态：
                    <span
                      style="color: #529b2e;font-weight:bold"
                      v-if="i.is_delete==0"
                    >开启</span>
                    <span
                      style="color:#F56C6C;font-weight:bold"
                      v-if="i.is_delete==1"
                    >关闭</span>
                  </span>
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
                    <el-button
                      size="small"
                      type="danger"
                      plain
                      v-if="i.is_delete==0"
                      @click="changeState(i.id,i.is_delete)"
                    >关闭</el-button>
                    <el-button
                      size="small"
                      plain
                      v-if="i.is_delete==1"
                      @click="changeState(i.id,i.is_delete)"
                    >启用</el-button>
                    <el-button
                      size="small"
                      type="primary"
                      @click="showDetail(i.id)"
                    >查看</el-button>
                  </div>
                </el-col>
              </el-col>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>

    <!--总数超过一页，再展示分页器-->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      :current-page="currentPage"
      @current-change="changePage"
    />
  </el-card>
</template>

<script>
import { onMounted, reactive, ref, toRefs } from 'vue'
import { ElMessage, ElRow, ElCol } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'

import axios from 'axios'
//import { raw } from 'body-parser'
export default {
  name: 'User',
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
      rid: '',
      tableData: [], // 数据列表
      multipleSelection: [], // 选中项
      total: 16, // 总条数
      currentPage: 1, // 当前页
      pageSize: 8, // 分页大小
      nowUsername: '',
      listData: [{
        id: 1,
        publisher: 'Life研究小组',
        cover: '20220714153525.jpg',
        title: '圣诞快乐！',
        brief: '感谢大家的支持与陪伴',
        content: '感谢大家的支持与陪伴感谢大家的支持与陪伴感谢大家的支持与陪伴',
        time: '2021-12-16T14:00:01.000Z',
        is_deleted: '0',
      },
      {
        id: 2,
        publisher: 'Life研究小组',
        cover: '20220714153525.jpg',
        title: '圣诞快乐！',
        brief: '感谢大家的支持与陪伴',
        content: '感谢大家的支持与陪伴感谢大家的支持与陪伴感谢大家的支持与陪伴',
        time: '2021-12-16T14:00:01.000Z',
        is_deleted: '0',
      }],
      url: '20220714153525.jpg',
      formData: {
        id: 0,
        publisher: 'Life研究小组',
        cover: '20220714153525.jpg',
        title: '圣诞快乐！',
        brief: '感谢大家的支持与陪伴',
        content: '感谢大家的支持与陪伴感谢大家的支持与陪伴感谢大家的支持与陪伴',
        time: '2021-12-16T14:00:01.000Z',
        is_deleted: '0',
      }
    })
    onMounted(() => {
      getRecommendList()
    })
    // 获取列表
    const getRecommendList = () => {
      state.loading = true
      axios.get('/recommend/FindRecommendPage', {
        params: {
          page: state.currentPage,
          size: state.pageSize
        }
      }).then(res => {
        if (res.code == 2000) {
          state.listData = res.data
          state.total = 16
        } else {
          ElMessage.error('数据加载出错')
        }
        state.loading = false
      })
    }
    const showDetail = (rid) => {
      router.push({
        path: `/recommendDetail`,
        query: {
          rid:rid
        }
      })      
    }
    const findById = () => {
      if (state.rid == '') {
        getRecommendList()
        return;
      }
      state.loading = true
      axios.get('/recommend/FindOneRecommend', {
        params: {
          rid: state.rid
        }
      }).then(res => {
        if (res.code == 2000) {
          state.listData = []
          state.listData.push(res.data)
        } else {
          ElMessage.error('数据加载出错')
        }
        state.total = 4
        state.loading = false
      })
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
      findById,
      showDetail
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