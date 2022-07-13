const express = require("express");
const router = express.Router()
const {Result} = require("../../config/result")
const mapper = require("../../services/recommend/index")


router.get("/FindOneRecommend", (req, res, next)=>{

    const {rid} = req.query

    mapper.findOneRecommend(rid).then((result)=>{

        new Result(result, "查询成功").success(res)

    }).catch((error)=>{
        new Result([], error).fail(res)
    })

})



router.get("/FindRecommendPage", (req, res, next)=>{

    const {page, size} = req.query

    mapper.findRecommendPage(page, size).then((result)=>{

        new Result(result, "查询成功").success(res)

    }).catch((error)=>{
        new Result([], error).fail(res)
    })

})



router.post("/EditRecommend", (req, res, next)=>{

    const recommend = req.body
    mapper.editRecommend(recommend).then((result)=>{
        new Result([], result).success(res)
    }).catch((error)=>{
        new Result([], error).fail(res)
    })

})



router.post("/CreateRecommend", (req, res, next)=>{

    const recommend = req.body
    mapper.createRecommend(recommend).then((result)=>{
        new Result([], result).success(res)
    }).catch((error)=>{
        new Result([], error).fail(res)
    })

})


router.get("/Delete", (req, res, next)=>{

    const {rid} = req.query
    mapper.deleteRecommend(rid).then((result)=>{
        new Result([], result).success(res)
    }).catch((error)=>{
        new Result([], error).fail(res)
    })

})



module.exports = router