const express = require("express");
const router = express.Router()
const {Result} = require("../../config/result")

const topicMapper = require("../../services/topic/index")


router.get("/FindOneTopic", (req, res, next)=>{

    const {tid} = req.query
    topicMapper.findOneTopic(tid).then((result)=>{
        new Result(result, "查询成功").success(res)
    }).catch((error)=>{
        new Result([], error).fail(res)
    })

})


router.get("/FindTopicPage", (req, res, next)=>{

    const {page, size} = req.query
    topicMapper.findTopicPage(page, size).then((result)=>{
        new Result(result, "查询成功").success(res)
    }).catch((error)=>{
        new Result([], error).fail(res)
    })

})



router.post("/EditTopic", (req, res, next)=>{

    const topic = req.body
    topicMapper.editTopic(topic).then((result)=>{
        new Result([], result).success(res)
    }).catch((error)=>{
        new Result([], error).fail(res)
    })

})



router.post("/CreateTopic", (req, res, next)=>{

    const topic = req.body
    topicMapper.createTopic(topic).then((result)=>{
        new Result([], result).success(res)
    }).catch((error)=>{
        new Result([], error).fail(res)
    })

})


router.get("/Delete", (req, res, next)=>{

    const {tid} = req.query
    topicMapper.deleteTopic(tid).then((result)=>{
        new Result([], result).success(res)
    }).catch((error)=>{
        new Result([], error).fail(res)
    })

})


module.exports = router