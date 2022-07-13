const express = require("express");
const router = express.Router()
 
const userMapper = require("../../services/user/index")
const {Result} = require("../../config/result")
// const {UserInfo} = require("../../pojo/user/index")


// 分页查询用户信息
router.get("/FindUsersByPage", (req, res, next)=>{
    const {page, size, sort} = req.query;
    userMapper.findUsersByPage(page, size, sort).then((results)=>{
        new Result(results, "查询成功").success(res)
    }).catch((error)=>{
        new Result([], "查询失败:"+error).fail(res)
    })
})


// 修改用户信息
router.post("/EditUserInfo", (req, res, next)=>{
    const userInfo = req.body;
    userMapper.editUserInfo(userInfo).then((result)=>{
        new Result([], "修改成功").success(res)
    }).catch((error)=>{
        new Result([], "查询失败:"+error).fail(res)
    })
})


// 修改用户状态(封禁)
router.get("/EditUserState", (req, res, next)=>{
    const {uid, state} = req.query
    userMapper.editUserState(uid, state).then((result)=>{
        new Result([], "修改成功").success(res)
    }).catch((error)=>{
        new Result([], "查询失败:"+error).fail(res)
    })
})

// 查找单个用户
router.get("/FindUserByID", (req, res, next)=>{
    const uid = req.query.uid;
    userMapper.findUserByID(uid).then((user)=>{
        new Result(user, "查询成功").success(res)
    }).catch((error)=>{
        new Result([], "查询失败:"+error).fail(res)
    })
})


// 删除某个用户
router.get("/Delete", (req, res, next)=>{

    const uid = req.query.uid;

    userMapper.deleteUser(uid).then((result)=>{
        new Result([], result).success(res)
    }).catch((error)=>{
        new Result([], error).fail(res)
    })
})




module.exports = router