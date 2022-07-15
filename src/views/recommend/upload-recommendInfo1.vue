<template>
  <div class="add">
    <el-card class="add-container">
      <el-form :model="recommendForm" :rules="rules" ref="goodRef" label-width="100px" class="recommendForm">
        <el-form-item required label="推荐标题">
          <el-input style="width: 300px" v-model="recommendForm.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="发布者">
          <el-input style="width: 300px" v-model="recommendForm.publisher" placeholder="请输入发布者名称"></el-input>
        </el-form-item>
        <el-form-item label="概述">
          <el-input style="width: 300px" v-model="recommendForm.brief" placeholder="请输入概述"></el-input>
        </el-form-item>
        <el-form-item label="推荐内容">
          <el-input
            v-model="recommendForm.content"
            :rows="8"
            type="textarea"
            placeholder="请输入推荐内容"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addPlaceholder()">添加图片占位符</el-button>
        </el-form-item>
        <el-form-item label="标签">
          <el-input style="width: 300px" v-model="recommendForm.brief" placeholder="请输入标签"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitAdd()">立即创建</el-button>
        </el-form-item>
        <el-form-item>
          <span>选择图片自动上传</span>
        </el-form-item>
        <el-form-item required label="内容封面">
          <el-upload
            class="avatar-uploader"
            :action="uploadRemServer"
            accept="jpg,jpeg,png"
            :data="itemForm_cover"
            :headers="{
              token: token
            }"
            :show-file-list="false"
            :before-upload="handleBeforeUpload"
            :on-success="handleUrlSuccess_cover"
          >
            <img style="width: 100px; height: 100px; border: 1px solid #e9e9e9;" v-if="recommendForm.cover" :src="recommendForm.cover" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="内容图片">
            <el-upload
                class="avatar-uploader"
                :action="uploadRemServer"
                accept="jpg,jpeg,png"
                :data="itemForm_picture"
                :headers="{
                token: token
                }"
                :show-file-list="false"
                :before-upload="handleBeforeUpload"
                :on-success="handleUrlSuccess_picture"
            >
            <img style="width: 100px; height: 100px; border: 1px solid #e9e9e9;" v-if="recommendForm.picture" :src="recommendForm.picture" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
                <el-form-item required label="背景图">
          <el-upload
            class="avatar-uploader"
            :action="uploadRemServer"
            accept="jpg,jpeg,png"
            :data="itemForm_back"
            :headers="{
              token: token
            }"
            :show-file-list="false"
            :before-upload="handleBeforeUpload"
            :on-success="handleUrlSuccess_back"
          >
            <img style="width: 100px; height: 100px; border: 1px solid #e9e9e9;" v-if="recommendForm.background" :src="recommendForm.background" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { reactive, ref, toRefs, onMounted, onBeforeUnmount, getCurrentInstance } from 'vue'
import axios from '@/utils/axios'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { localGet, hasEmoji, uploadRemServer } from '@/utils'

export default {
  name: 'AddRecommend',
  setup() {
    const { proxy } = getCurrentInstance()
    // console.log('proxy', proxy)
    const editor = ref(null)
    const goodRef = ref(null)
    const route = useRoute()
    const router = useRouter()
    const { id } = route.query
    // upload picture


    const state = reactive({
      uploadRemServer,
      token: localGet('token') || '',
      itemForm_cover: {
        cid: '',
        name: "cover"
      },
      itemForm_picture: {
        cid: '',
        name: "picture"
      },
      itemForm_back: {
        cid: '',
        name: "background"
      },
      recommendForm: {
        publisher: '',
        cover: '',
        title: '',
        brief: '',
        content: '',
        picture: '',
        tag: '',
        background: ''
      },
      rules: {
        publisher: [
          { required: 'true', message: '请填写作者', trigger: ['change'] }
        ],
        title: [
          { required: 'true', message: '请填写标题', trigger: ['change'] }
        ]
      }
    })
    // let instance
    const addPlaceholder = () => {
        state.recommendForm.content += "@pic@"
    }
    const submitAdd = () => {
      goodRef.value.validate((vaild) => {
        if (vaild) {
          // 默认新增用 post 方法
          let httpOption = axios.post
          let params = {
            title: state.recommendForm.title,
            publisher: state.recommendForm.publisher,
            cover: state.recommendForm.cover.substring(34),
            background: state.recommendForm.background.substring(34),
            picture: state.recommendForm.picture.substring(34),
            brief: state.recommendForm.brief,
            content: state.recommendForm.content,
            tag: state.recommendForm.tag
          }
          if (hasEmoji(params.title)) {
            ElMessage.error('不要输入表情')
            return
          }
          if (params.title.length > 128) {
            ElMessage.error('推荐标题不能超过128个字符')
            return
          }
          if (params.brief.length > 200) {
            ElMessage.error('内容概述不能超过200个字符')
            return
          }
        //   console.log('params', params)
        //得到数据
          httpOption('/recommend/CreateRecommend', params).then(res => {
            state.itemForm_cover.cid = res.data.id
            state.itemForm_picture.cid = res.data.id
            state.itemForm_back.cid = res.data.id
            ElMessage.success('添加成功')
            // router.push({ path: '/recommend_add' })//返回的路径
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
    const handleUrlSuccess_cover = (val) => {
    //   console.log(val.img)
      state.recommendForm.cover = "http://1.117.74.41:8080/templates/" + val.img || ''
    }
    const handleUrlSuccess_picture = (val) => {
      // console.log(val)
      state.recommendForm.picture = "http://1.117.74.41:8080/templates/" + val.img || ''
    }
    const handleUrlSuccess_back = (val) => {
      // console.log(val)
      state.recommendForm.background = "http://1.117.74.41:8080/templates/" + val.img || ''
    }
    // const handleChangeCate = (val) => {
    //   state.categoryId = val[2] || 0
    // }
    
    return {
      ...toRefs(state),
      goodRef,
      submitAdd,
      handleBeforeUpload,
      handleUrlSuccess_cover,
      handleUrlSuccess_picture,
      handleUrlSuccess_back,
      editor,
      addPlaceholder,
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
  .avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
  }

</style>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>