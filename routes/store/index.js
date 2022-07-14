const express = require("express");
const router = express.Router()
const mapper = require("../../services/store/index")
const {Result} = require("../../config/result")


router.get("/FindOneStore", (req, res, next)=>{
    const {sid} = req.query

    mapper.findOneStore(sid).then((result)=>{
        new Result(result, "查询成功").success(res)
    }).catch((error)=>{
        new Result([], error).fail(res)
    })
})


router.get("/FindStorePage", (req, res, next)=>{
    const {page, size} = req.query

    mapper.findStorePage(page, size).then((result)=>{
        new Result(result, "查询成功").success(res)
    }).catch((error)=>{
        new Result([], error).fail(res)
    })
})


router.post("/CreateStore", (req, res, next)=>{
    const store = req.body

    mapper.createStore(store).then((result)=>{
        new Result({"id":result}, "创建成功").success(res)
    }).catch((error)=>{
        new Result([], error).fail(res)
    })
})



router.post("/EditStore", (req, res, next)=>{
    const store = req.body

    mapper.editStore(store).then((result)=>{
        new Result([], result).success(res)
    }).catch((error)=>{
        new Result([], error).fail(res)
    })
})



router.get("/Delete", (req, res, next)=>{
    const {sid} = req.query

    mapper.deleteStore(sid).then((result)=>{
        new Result([], result).success(res)
    }).catch((error)=>{
        new Result([], error).fail(res)
    })
})

router.get("/Recover", (req, res, next)=>{
    const {sid} = req.query

    mapper.recoverStore(sid).then((result)=>{
        new Result([], result).success(res)
    }).catch((error)=>{
        new Result([], error).fail(res)
    })
})


module.exports = router

