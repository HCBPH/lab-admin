<template>
  <el-card class="order-container">
    <template #header>
      <div class="header">
        <el-input
          style="width: 200px; margin-right: 10px"
          placeholder="请输入用户ID"
          v-model="username"
          size="small"
          clearable
        />

        <el-button
          type="primary"
          size="small"
          @click="findByID()"
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
        label="用户ID"
      >
      </el-table-column>
      <el-table-column
        prop="username"
        label="用户名"
      >
      </el-table-column>
      <el-table-column
        prop="name"
        label="昵称"
      >
      </el-table-column>
      <el-table-column
        prop="email"
        width="220"
        label="邮箱"
      >
      </el-table-column>
      <el-table-column
        prop="birthday"
        label="生日"
      >
      </el-table-column>
      <el-table-column
        prop="sex"
        label="性别"
      >
      </el-table-column>

      <el-table-column
        prop="state"
        label="状态"
        :filters="[{ text: '正常', value: 1 }, { text: '封禁', value: 2 }, { text: '注销', value: 0 }]"
        :filter-method="filterTag"
        filter-placement="top-start"
      >
        <template #default='scope'>
          <span
            v-if="scope.row.state == 1"
            style="color:#529b2e;font-weight:bold"
          >正常</span>
          <span
            v-else-if="scope.row.state == 2"
            style="color:#F56C6C;font-weight:bold"
          >封禁</span>
          <span
            v-else
            style="color:#A8ABB2;font-weight:bold"
          >注销</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="300"
      >
        <template #default='scope'>
          <el-button
            size="mini"
            type="primary"
            @click="showDialog(scope.row)"
          >
            修改
          </el-button>
          <el-button
            size="mini"
            type="danger"
            plain
            v-if="scope.row.state == 1"
            @click="changeState(scope.row,2)"
          >
            封禁
          </el-button>
          <el-button
            size="mini"
            type="warning"
            plain
            v-if="scope.row.state == 1"
            @click="changeState(scope.row,0)"
          >
            注销
          </el-button>
          <el-button
            size="mini"
            plain
            v-if="scope.row.state !=1 "
            @click="changeState(scope.row,1)"
          >
            恢复
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
      <h2>编辑用户信息
      </h2>
      <el-form
        align='left'
        style="margin-right:40px;margin-top:40px;"
        label-position="right"
        label-width="80px"
        :model="formData"
      >
        <el-form-item
          style="font-size:20px;"
          label="用户ID"
          prop="id"
        >
          <el-input
            :disabled="true"
            v-model="formData.id"
            placeholder="请输入用户ID"
            class="input-font"
          ></el-input>
        </el-form-item>
        <el-form-item
          style="font-size:20px;"
          label="用户名"
          prop="username"
        >
          <el-input
            :disabled="true"
            v-model="formData.username"
            placeholder="请输入用户名"
            class="input-font"
          ></el-input>
        </el-form-item>
        <el-form-item
          style="font-size:20px;"
          label="昵称"
          prop="name"
        >
          <el-input
            v-model="formData.name"
            placeholder="请输入昵称"
            class="input-font"
          >
          </el-input>
        </el-form-item>
        <el-form-item
          style="font-size:20px;"
          label="邮箱"
          prop="email"
        >
          <el-input
            v-model="formData.email"
            placeholder="请输入邮箱"
            class="input-font"
          >
          </el-input>
        </el-form-item>
        <el-form-item
          style="font-size:20px;"
          label="电话"
          prop="tel"
        >
          <el-input
            v-model="formData.tel"
            placeholder="请输入电话号码"
            class="input-font"
          ></el-input>
        </el-form-item>
        <el-form-item
          style="font-size:20px;"
          label="生日"
          prop="birthday"
        >

          <el-input
            v-model="formData.birthday"
            placeholder="请输入生日"
            class="input-font"
          ></el-input>
        </el-form-item>
        <el-form-item
          style="font-size:20px;"
          label="性别"
          prop="sex"
        >
          <el-select
            v-model="formData.sex"
            placeholder="请输入性别"
          >
            <el-option
              label="男"
              value="男"
            ></el-option>
            <el-option
              label="女"
              value="女"
            ></el-option>
            <el-option
              label="其他"
              value="其他"
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
          @click="submitUser()"
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
  name: 'User',
  setup () {
    const state = reactive({
      loading: false,
      dialogVisible: false,
      username: '',
      tableData: [], // 数据列表
      multipleSelection: [], // 选中项
      total: 30, // 总条数
      currentPage: 1, // 当前页
      pageSize: 10, // 分页大小
      nowUsername: '',
      formData: {
        id: 0,
        name: '',
        email: '',
        tel: '',
        birthday: '',
        sex: '',
      }
    })
    onMounted(() => {
      getUserList()
    })
    // 获取用户列表
    const getUserList = () => {
      state.loading = true
      axios.get('/user/FindUsersByPage', {
        params: {
          page: state.currentPage,
          size: state.pageSize,
          sort: 'desc'
        }
      }).then(res => {
        console.log(res)
        if (res.code == 2000) {
          state.tableData = res.data
          state.total = 30
        } else {
          ElMessage.error('数据加载出错')
        }
        state.loading = false
      })
    }
    const findByID = () => {
      if (state.username == '') {
        getUserList()
        return;
      }
      state.loading = true
      axios.get('/user/FindUserByID', {
        params: {
          uid: state.username
        }
      }).then(res => {
        if (res.code == 2000) {
          state.tableData = []
          state.tableData.push(res.data)
          state.total = 4
        } else {
          ElMessage.error('数据加载出错')
        }
        state.loading = false
      })
    }
    const submitUser = () => {
      state.dialogVisible = false
      axios.post('/user/EditUserInfo', {
        uid: state.formData.id,
        name: state.formData.name,
        email: state.formData.email,
        tel: state.formData.tel,
        birthday: state.formData.birthday,
        sex: state.formData.sex
      },
        { 'Content-Type': 'application/json' }).then(res => {
          if (res.code == 2000) {
            ElMessage({
              type: 'success',
              message: '修改成功'
            })
            getUserList()
            state.dialogVisible = false
          } else {
            ElMessage.error('修改失败')
          }
          state.loading = false
        })
    }
    const showDialog = (row) => {
      state.dialogVisible = true
      state.formData.id = row.id
      state.formData.username = row.username
      state.formData.name = row.name
      state.formData.email = row.email
      state.formData.tel = row.tel
      state.formData.birthday = row.birthday
      state.formData.sex = row.sex
    }
    const changeState = (row, newState) => {
      axios.get('/user/EditUserState', {
        params: {
          uid: row.id,
          state: newState
        }
      }).then(res => {
        if (res.code == 2000) {
          ElMessage({
            type: 'success',
            message: '状态修改成功'
          })
          getUserList()
        } else {
          ElMessage.error('修改失败')
        }
        state.loading = false
      })
    }
    const handleOption = () => {
      state.currentPage = 1
      getUserList()
    }
    // 选择项
    const handleSelectionChange = (val) => {
      state.multipleSelection = val
    }
    const changePage = (val) => {
      state.currentPage = val
      getUserList()
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
      getUserList,
      changePage,
      handleOption,
      handleConfig,
      filterTag,
      showDialog,
      submitUser,
      changeState,
      findByID
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