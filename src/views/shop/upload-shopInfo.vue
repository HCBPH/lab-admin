<template>
  <div class="add">
    <el-card class="add-container">
      <el-form :model="shopForm" :rules="rules" ref="goodRef" label-width="100px" class="shopForm">
        <el-form-item required label="店铺名称">
          <el-input style="width: 300px" v-model="shopForm.shopName" placeholder="请输入店铺名称"></el-input>
        </el-form-item>
        <el-form-item label="店铺介绍">
          <el-input style="width: 300px" v-model="shopForm.shopIntro" placeholder="请输入店铺介绍"></el-input>
        </el-form-item>
        <el-form-item label="店铺评分">
          <el-input type="float" min="0" style="width: 300px" v-model="shopForm.shopScore" placeholder="请输入店铺评分"></el-input>
        </el-form-item>
        <el-form-item label="店铺消费">
          <el-input type="number" min="0" style="width: 300px" v-model="shopForm.shopConsume" placeholder="请输入店铺消费"></el-input>
        </el-form-item>
        <el-form-item label="店铺地址">
          <el-input type="text" min="0" style="width: 300px" v-model="shopForm.shopAddress" placeholder="请输入店铺地址"></el-input>
        </el-form-item>
        <el-form-item label="店铺营业时间">
          <el-input style="width: 300px" v-model="shopForm.shopBusinessTime" placeholder="店铺营业时间"></el-input>
        </el-form-item>
        <el-form-item label="店铺联系方式">
          <el-input style="width: 300px" maxlength="11" v-model="shopForm.shopTel" placeholder="店铺联系方式"></el-input>
        </el-form-item>
        <el-form-item required label="店铺封面">
          <el-upload
            class="avatar-uploader"
            :action="uploadImgServer"
            accept="jpg,jpeg,png"
            :data="itemForm"
            :headers="{
              token: token
            }"
            :show-file-list="false"
            :before-upload="handleBeforeUpload"
            :on-success="handleUrlSuccess"
          >
            <img style="width: 100px; height: 100px; border: 1px solid #e9e9e9;" v-if="shopForm.shopCoverImg" :src="shopForm.shopCoverImg" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="店铺详情">
          <el-input
            v-model="shopForm.textarea"
            :rows="5"
            type="textarea"
            placeholder="请输入店铺详情"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitAdd()">{{ id ? '立即修改' : '立即创建' }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { reactive, ref, toRefs, onMounted, onBeforeUnmount, getCurrentInstance } from 'vue'
// import WangEditor from 'wangeditor'
import axios from '@/utils/axios'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { localGet, uploadImgServer, hasEmoji } from '@/utils'
export default {
  name: 'AddShop',
  setup() {
    const { proxy } = getCurrentInstance()
    // console.log('proxy', proxy)
    const editor = ref(null)
    const goodRef = ref(null)
    const route = useRoute()
    const router = useRouter()
    const { id } = route.query
    const state = reactive({
      uploadImgServer,
      token: localGet('token') || '',
      id: id,
      itemForm: {
        id: 2,
        imgType: "picture"
      },
      defaultCate: '',
      shopForm: {
        shopName: '',
        shopIntro: '',
        shopScore: '',
        shopConsume: '',
        shopAddress: '',
        shopBusinessTime: '',
        shopCoverImg: '',
        shopTel: '',
        textarea: ''
      },
      rules: {
        shopCoverImg: [
          { required: 'true', message: '请上传店铺封面', trigger: ['change'] }
        ],
        shopName: [
          { required: 'true', message: '请填写店铺名称', trigger: ['change'] }
        ]
      },
      // categoryId: '',
      // category: {
      //   lazy: true,
      //   lazyLoad(node, resolve) {
      //     const { level = 0, value } = node
      //     axios.get('/categories', {
      //       params: {
      //         pageNumber: 1,
      //         pageSize: 1000,
      //         categoryLevel: level + 1,
      //         parentId: value || 0
      //       }
      //     }).then(res => {
      //       const list = res.list
      //       const nodes = list.map(item => ({
      //         value: item.categoryId,
      //         label: item.categoryName,
      //         leaf: level > 1
      //       }))
      //       resolve(nodes)
      //     })
      //   }
      // }
    })
    let instance
    onMounted(() => {
      // instance = new WangEditor(editor.value)
      // instance.config.showLinkImg = false
      // instance.config.showLinkImgAlt = false
      // instance.config.showLinkImgHref = false
      // instance.config.uploadImgMaxSize = 2 * 1024 * 1024 // 2M
      // instance.config.uploadFileName = 'file'
      // instance.config.uploadImgHeaders = {
      //   token: state.token
      // }
      // // 图片返回格式不同，需要自定义返回格式
      // instance.config.uploadImgHooks = {
      //   // 图片上传并返回了结果，想要自己把图片插入到编辑器中
      //   // 例如服务器端返回的不是 { errno: 0, data: [...] } 这种格式，可使用 customInsert
      //   customInsert: function(insertImgFn, result) {
      //     console.log('result', result)
      //     // result 即服务端返回的接口
      //     // insertImgFn 可把图片插入到编辑器，传入图片 src ，执行函数即可
      //     if (result.data && result.data.length) {
      //       result.data.forEach(item => insertImgFn(item))
      //     }
      //   }
      // }
      // instance.config.uploadImgServer = uploadImgsServer
      // Object.assign(instance.config, {
      //   onchange() {
      //     console.log('change')
      //   },
      // })
      // instance.create()
      if (id) {
        axios.get(`/goods/${id}`).then(res => {
          const { goods, firstCategory, secondCategory, thirdCategory } = res
          state.shopForm = {
            // goodsName: goods.goodsName,
            // goodsIntro: goods.goodsIntro,
            // originalPrice: goods.originalPrice,
            // sellingPrice: goods.sellingPrice,
            // stockNum: goods.stockNum,
            // goodsSellStatus: String(goods.goodsSellStatus),
            // goodsCoverImg: proxy.$filters.prefix(goods.goodsCoverImg),
            // tag: goods.tag,
            // categoryId: goods.goodsCategoryId
          }
          // if (instance) {
          //   // 初始化商品详情 html
          //   instance.txt.html(goods.goodsDetailContent)
          // }
        })
      }
    })
    onBeforeUnmount(() => {
      // instance.destroy()
      // instance = null
    })
    const submitAdd = () => {
      goodRef.value.validate((vaild) => {
        if (vaild) {
          // 默认新增用 post 方法
          let httpOption = axios.post
          let params = {
            name: state.shopForm.shopName,
            cover: state.shopForm.shopCoverImg.substring(30),
            background: "",
            introduce: state.shopForm.shopIntro,
            detail: state.shopForm.textarea,
            semester: "",
            picture: null,
            score: state.shopForm.shopScore,
            consume: state.shopForm.shopConsume,
            location: "",
            address: state.shopForm.shopAddress,
            business_hours: state.shopForm.shopBusinessTime,
            tel: state.shopForm.shopTel,
            style:  "00000000000000",
            type: "00000000000000",
            spare: null
          }
          if (hasEmoji(params.name)) {
            ElMessage.error('不要输入表情')
            return
          }
          if (params.name.length > 128) {
            ElMessage.error('店铺名称不能超过128个字符')
            return
          }
          if (params.introduce.length > 200) {
            ElMessage.error('店铺简介不能超过200个字符')
            return
          }
          console.log('params', params)
          if (id) {
            params.goodsId = id
            // 修改商品使用 put 方法
            httpOption = axios.put
          }
          httpOption('/store/CreateStore', params).then(() => {
            ElMessage.success(id ? '修改成功' : '添加成功')
            router.push({ path: '/shop_info' })
          })
        }
      })
    }
    const handleBeforeUpload = (file) => {
      const sufix = file.name.split('.')[1] || ''
      if (!['jpg', 'jpeg', 'png'].includes(sufix)) {
        ElMessage.error('请上传 jpg、jpeg、png 格式的图片')
        return false
      }
    }
    const handleUrlSuccess = (val) => {
      // console.log(val)
      state.shopForm.shopCoverImg = "http://1.117.74.41:8080/store/" + val.data.picture || ''
    }
    // const handleChangeCate = (val) => {
    //   state.categoryId = val[2] || 0
    // }
    
    return {
      ...toRefs(state),
      goodRef,
      submitAdd,
      handleBeforeUpload,
      handleUrlSuccess,
      editor,
      // handleChangeCate,
    }
  }
}
</script>

<style scoped>
  .add {
    display: flex;
  }
  .add-container {
    flex: 1;
    height: 100%;
  }
  .avatar-uploader {
    width: 100px;
    height: 100px;
    color: #ddd;
    font-size: 30px;
  }
  .avatar-uploader-icon {
    display: block;
    width: 100%;
    height: 100%;
    border: 1px solid #e9e9e9;
    padding: 32px 17px;
  }
</style>