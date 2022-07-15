<template>
  <el-card class="swiper-container">
    <template #header>
      <div class="header">
        <!-- <span>{{tableData}}</span> -->
        <span>店铺信息</span>
      </div>
    </template>
    <el-table
      v-loading="loading"
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      >
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        label="店铺信息"
        width="200">
        <template #default="scope">
          <img style="width: 150px;height: 150px" :src="handleImage(scope.row.cover)" alt="店铺封面">
        </template>
      </el-table-column>
      <el-table-column
        label="店铺名称"
        width="200"
        >
        <template #default="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="introduce"
        label="店铺介绍"
        fit="true"
      >
      </el-table-column>
      <el-table-column
        prop="business_hours"
        label="营业时间"
        width="200"
      >
      </el-table-column>
      <el-table-column
        label="操作"
        width="100"
      >
        <template #default="scope">
          <a style="cursor: pointer; margin-right: 10px" @click="handleEdit(scope.row.id)">修改</a>
          <el-popconfirm
            title="确定删除吗？"
            @confirm="handleDeleteOne(scope.row.id)"
          >
            <template #reference>
              <a style="cursor: pointer">删除</a>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!--总数超过一页，再展示分页器-->
    <!-- <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      :current-page="currentPage"
      @current-change="changePage"
    /> -->
  </el-card>
  <DialogAddSwiper ref='editShop' :reload="getShopInfo" :type="type" />
</template>

<script>
import { ref, reactive, onMounted, toRefs } from "vue";
import axios from '@/utils/axios'
import { stringifyQuery } from 'vue-router';
import DialogAddSwiper from '@/components/DialogAddSwiper.vue'
import { ElMessage } from 'element-plus'
export default {
  name: 'Shop',
  components: {
    DialogAddSwiper
  },
  setup() {
    const editShop = ref(null)
    const state = reactive({
      loading: false,
      tableData: [], // 数据列表
      total: 0, // 总条数
      currentPage: 1, // 当前页
      pageSize: 10, // 分页大小
      type: 'add', // 操作类型
      str: ''
    })
    //send request
    onMounted(() => {
      getShopInfo()
    })
    const getShopInfo = () => {
      state.loading = true
      axios.get('/store/FindStorePage',{
        params: {
          page: state.currentPage,
          size: state.pageSize
        }
        }
      ).then(res => {
        // console.log(res.data)
        state.tableData = res.data
        state.loading = false
      })
    }
    const changePage = (val) => {
      state.currentPage = val
      getShopInfo()
    }
    const handleImage = (str) => {
      // for(data in tableData){
      //   if(data.cover === "" || data.cover === "empty"){
      //   data.cover = "http://1.117.74.41:8080/store/1.jpg"
      //   }else if(data.cover.split("&")[0] === "empty"){
      //   data.cover = "http://1.117.74.41:8080/store/"+data.cover.split("&")[1]
      //   }else{
      //   data.cover = "http://1.117.74.41:8080/store/"+data.cover.split("&")[0]
      // }
      // console.log(data.cover)
      // }
      if(str === "" || str === "empty"){
        str = "http://1.117.74.41:8080/store/1.jpg"
      }else if(str.split("&")[0] === "empty"){
        str = "http://1.117.74.41:8080/store/"+str.split("&")[1]
      }else{
        str = "http://1.117.74.41:8080/store/"+str.split("&")[0]
      }
      console.log(str)
      return str
    }
    const handleDeleteOne = (id) => {
      axios.get(`/store/Delete?sid=${id}`).then(() => {
        ElMessage.success('删除成功')
        getShopInfo()
      })
    }
    const handleEdit = (id) => {
      state.type = 'edit'
      editShop.value.open(id)
    }
    return{
      ...toRefs(state),
      getShopInfo,
      changePage,
      handleImage,
      handleDeleteOne,
      handleEdit,
      editShop
    }
  }


}
</script>

<style>
.time {
  font-size: 12px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button {
  padding: 0;
  min-height: auto;
}

.image {
  width: 100%;
  display: block;
}
</style>
