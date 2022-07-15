<template>
  <el-card class="order-container">
    <template #header>
      <div class="header">
        <el-input
          style="width: 200px; margin-right: 10px"
          placeholder="请输入投诉人用户名"
          v-model="username"
          size="small"
          clearable
        />

        <el-button
          type="primary"
          size="small"
          @click="findByUser()"
        >搜索</el-button>
      </div>
    </template>
    <el-table
      v-loading="loading"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      >
      </el-table-column>
      <el-table-column
        prop="id"
        label="投诉工单ID"
      >
      </el-table-column>
      <el-table-column
        prop="accuser"
        label="投诉人"
      >
      </el-table-column>
      <el-table-column
        prop="type"
        label="投诉类型"
      >
      </el-table-column>
      <el-table-column
        prop="accused"
        label="被投诉人"
      >
      </el-table-column>
      <el-table-column
        prop="cid"
        label="被投诉内容ID"
      >
      </el-table-column>
      <el-table-column
        prop="reason"
        label="投诉理由"
      >
      </el-table-column>
      <el-table-column
        prop="time"
        label="创建时间"
      >
      </el-table-column>
      <el-table-column
        prop="feedback"
        label="投诉反馈"
      >
      </el-table-column>
      <el-table-column
        prop="state"
        label="处理状态"
        :filters="[{ text: '未处理', value: 0 },{ text: '已处理', value: 1 }, { text: '已驳回', value: 2 }, { text: '已取消', value: 3 }]"
        :filter-method="filterTag"
        filter-placement="top-start"
      >
        <template #default='scope'>
          <span v-if="scope.row.state == 1">已处理</span>
          <span v-else-if="scope.row.state == 2">已驳回</span>
          <span v-else-if="scope.row.state == 3">已取消</span>
          <span v-else>未处理</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default='scope'>
          <el-button
            size="mini"
            type="primary"
            v-if="scope.row.state ==0 "
            @click="showDialog(scope.row,0)"
          >
            处理
          </el-button>
          <el-button
            size="mini"
            v-if="scope.row.state !=0 "
            @click="showDialog(scope.row,1)"
          >
            查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>
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
  <el-dialog
    v-model="dialogVisible"
    title=""
    width="40%"
  >
    <div align="center">
      <h2>投诉信息
      </h2>
      <el-form
        align='left'
        style="margin-right:40px;margin-top:40px;"
        label-position="right"
        label-width="100px"
        :model="formData"
      >
        <el-form-item
          style="font-size:20px;"
          label="投诉工单ID"
          prop="id"
        >
          <el-input
            :disabled="true"
            v-model="formData.id"
            placeholder="请输入ID"
            class="input-font"
          ></el-input>
        </el-form-item>
        <el-form-item
          style="font-size:20px;"
          label="投诉人"
          prop="accuser"
        >
          <el-input
            :disabled="true"
            v-model="formData.accuser"
            placeholder="请输入投诉人"
            class="input-font"
          ></el-input>
        </el-form-item>
        <el-form-item
          style="font-size:20px;"
          label="投诉类型"
          prop="type"
        >
          <el-input
            :disabled="true"
            v-model="formData.type"
            placeholder="请输入类型"
            class="input-font"
          >
          </el-input>
        </el-form-item>
        <el-form-item
          style="font-size:20px;"
          label="被投诉人"
          prop="accused"
        >
          <el-input
            :disabled="true"
            v-model="formData.accused"
            placeholder="请输入被投诉人"
            class="input-font"
          >
          </el-input>
        </el-form-item>
        <el-form-item
          :disabled="true"
          style="font-size:20px;"
          label="被投诉内容ID"
          prop="cid"
        >
          <el-input
            :disabled="true"
            v-model="formData.cid"
            placeholder="请输入内容ID"
            class="input-font"
          ></el-input>
        </el-form-item>
        <el-form-item
          style="font-size:20px;"
          label="投诉理由"
          prop="reason"
        >
          <el-input
            :disabled="true"
            v-model="formData.reason"
            placeholder="请输入投诉理由"
            class="input-font"
          ></el-input>
        </el-form-item>
        <el-form-item
          style="font-size:20px;"
          label="投诉反馈"
          prop="feedback"
        >
          <el-input
            :disabled="look"
            v-model="formData.feedback"
            placeholder="请输入投诉反馈"
            class="input-font"
          ></el-input>
        </el-form-item>
        <el-form-item
          style="font-size:20px;"
          label="处理状态"
          prop="state"
        >
          <el-select
            :disabled="look"
            v-model="formData.state"
            placeholder="请选择"
            class="input-font"
          >
            <el-option
              label="处理"
              value="1"
            ></el-option>
            <el-option
              label="驳回"
              value="2"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button
          type="primary"
          @click="submitFeedback()"
          v-if="!look"
        >Confirm</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { onMounted, reactive, ref, toRefs } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'
//import { raw } from 'body-parser'
export default {
  name: 'Accuse',
  setup () {
    const state = reactive({
      loading: false,
      look: false,
      dialogVisible: false,
      username: '',
      tableData: [], // 数据列表
      multipleSelection: [], // 选中项
      total: 10, // 总条数
      currentPage: 1, // 当前页
      pageSize: 10, // 分页大小
      nowUsername: '',
      formData: {
        id: 0,
        accuser: '',
        type: '',
        accused: '',
        cid: '',
        reason: '',
        feedback: '',
        state: ''
      }
    })
    onMounted(() => {
      getAccuseList()
    })
    // 获取用户列表
    const getAccuseList = () => {
      state.loading = true
      axios.get('/accuse/FindAccusePage', {
        params: {
          page: state.currentPage,
          size: state.pageSize
        }
      }).then(res => {
        if (res.code == 2000) {
          state.tableData = res.data
        } else {
          ElMessage.error('数据加载出错')
        }
        state.loading = false
      })
    }
    const submitFeedback = () => {
      if (state.formData.state == '') {
        ElMessage.error('请选择处理状态')
        return;
      }
      axios.post('/accuse/ProcessAccuse', {
        aid: state.formData.id,
        state: state.formData.state,
        feedback: state.formData.feedback
      },
        { 'Content-Type': 'application/json' }).then(res => {
          if (res.code == 2000) {
            ElMessage({
              type: 'success',
              message: '提交成功'
            })
            state.dialogVisible = false
            getAccuseList()
          } else {
            ElMessage.error('提交失败')
          }
          state.loading = false
        })
    }
    const findByUser = () => {
      if (state.username == '') {
        getAccuseList()
        return;
      }
      axios.get('/accuse/FindAccuseByAccuser', { params: { username: state.username } }).then(res => {
        if (res.code == 2000) {
          state.tableData = res.data
        } else {
          ElMessage.error('数据获取失败')
        }
        state.loading = false
      })
    }
    const showDialog = (row, i) => {
      state.dialogVisible = true
      state.formData.id = row.id
      state.formData.accuser = row.accuser
      state.formData.type = row.type
      state.formData.accused = row.accused
      state.formData.cid = row.cid
      state.formData.reason = row.reason
      state.formData.feedback = row.feedback
      if (i == 0) {
        state.formData.state = ''
        state.look = false
      } else {
        state.formData.state = row.state
        state.look = true
      }
    }
    const handleOption = () => {
      state.currentPage = 1
      getOrderList()
    }
    // 选择项
    const handleSelectionChange = (val) => {
      state.multipleSelection = val
    }
    const changePage = (val) => {
      state.currentPage = val
      getAccuseList()
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
      getAccuseList,
      changePage,
      handleOption,
      handleConfig,
      filterTag,
      showDialog,
      submitFeedback,
      findByUser
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