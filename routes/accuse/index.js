const express = require("express");
const router = express.Router()
const {Result} = require("../../config/result")

const accuseMapper = require("../../services/accuse/index")


router.get("/FindOneAccuse", function(req, res, next){

    const {aid} = req.query

    if(aid === undefined){
        new Result([], "查询失败:参数有误").fail(res)
    }else{
        accuseMapper.findOneAccuse(aid).then((result) => {
            // console.log(result)
            new Result(result).success(res)
        }).catch((error)=>{
            // console.log(error)
            new Result([], "修改失败:"+error).fail(res)
        })
    }

})



router.get("/FindAccusePage", function(req, res, next){

    const {page, size} = req.query

    if(page === undefined || size === undefined){
        new Result([], "查询失败:参数有误").fail(res)
    }else{
        accuseMapper.findAccusePage(page, size).then((result) => {
            // console.log(result)
            new Result(result, "查询成功").success(res)
        }).catch((error)=>{
            // console.log(error)
            new Result([], "查询失败:"+error).fail(res)
        })
    }
})



router.get("/FindProcessedAccusePage", function(req, res, next){

    const {page, size} = req.query

    if(page === undefined || size === undefined){
        new Result([], "查询失败:参数有误").fail(res)
    }else{
        accuseMapper.findProcessedAccusePage(page, size).then((result) => {
            // console.log(result)
            new Result(result, "查询成功").success(res)
        }).catch((error)=>{
            // console.log(error)
            new Result([], "查询失败:"+error).fail(res)
        })
    }
})



router.get("/FindUnprocessedAccusePage", function(req, res, next){

    const {page, size} = req.query

    if(page === undefined || size === undefined){
        new Result([], "查询失败:参数有误").fail(res)
    }else{
        accuseMapper.findUnprocessedAccusePage(page, size).then((result) => {
            // console.log(result)
            new Result(result, "查询成功").success(res)
        }).catch((error)=>{
            // console.log(error)
            new Result([], "查询失败:"+error).fail(res)
        })
    }
})



router.get("/FindAccuseByAccused", function(req, res, next){

    const {username} = req.query

    if(username === undefined){
        new Result([], "查询失败:参数有误").fail(res)
    }else{
        accuseMapper.findAccuseByAccused(username).then((result) => {
            // console.log(result)
            new Result(result, "查询成功").success(res)
        }).catch((error)=>{
            // console.log(error)
            new Result([], "查询失败:"+error).fail(res)
        })
    }
})



router.get("/FindAccuseByAccuser", function(req, res, next){

    const {username} = req.query
    // console.log(username)

    if(username === undefined){
        new Result([], "查询失败:参数有误").fail(res)
    }else{
        accuseMapper.findAccuseByAccuser(username).then((result) => {
            // console.log(result)
            new Result(result, "查询成功").success(res)
        }).catch((error)=>{
            // console.log(error)
            new Result([], "查询失败:"+error).fail(res)
        })
    }
})


router.get("/FindAccuseByCid", function(req, res, next){

    const {cid} = req.query

    if(cid === undefined){
        new Result([], "查询失败:参数有误").fail(res)
    }else{
        accuseMapper.findAccuseByCid(cid).then((result) => {
            // console.log(result)
            new Result(result, "查询成功").success(res)
        }).catch((error)=>{
            // console.log(error)
            new Result([], "查询失败:"+error).fail(res)
        })
    }
})



router.post("/ProcessAccuse", function(req, res, next){

    const {aid, state, feedback} = req.body

    if(aid === undefined || state === undefined || feedback === undefined){
        new Result([], "查询失败:参数有误").fail(res)
    }else{
        accuseMapper.processAccuse(aid, state, feedback).then((result) => {
            // console.log(result)
            new Result(result, "查询成功").success(res)
        }).catch((error)=>{
            // console.log(error)
            new Result([], "查询失败:"+error).fail(res)
        })
    }
})


router.get("/Delete", (req, res, next)=>{

    const {aid} = req.query

    accuseMapper.deleteAccuse(aid).then((result)=>{
        new Result([], result).success(res)
    }).catch((error)=>{
        console.log(error)
        new Result([], error).fail(res)
    })

})


router.get("/Recover", (req, res, next)=>{

    const {aid} = req.query

    accuseMapper.recoverAccuse(aid).then((result)=>{
        new Result([], result).success(res)
    }).catch((error)=>{
        console.log(error)
        new Result([], error).fail(res)
    })

})

module.exports = router
