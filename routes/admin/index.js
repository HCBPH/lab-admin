const express = require("express");
const router = express.Router();
const {login, register} = require("../../services/admin/index")
const {Result} = require("../../config/result")


router.post("/login", (req, res, next)=>{
    const {username, password} = req.body
    login(username, password).then((result)=>{
        const {type, msg} = result
        if(type === 1){
            new Result(result.data, msg).success(res)
        }else {
            new Result([], msg).fail(res)
        }
    }).catch((error)=>{
        new Result([], error).success(res)
        console.log("catch route/admin/index.js:", error)
    })
})


router.post("/register", (req, res, next)=>{
    const {username, password, alias, auth} = req.body
    register({
        username:username,
        password:password,
        alias:alias,
        auth:auth
    }).then((result)=>{
        const {type, msg} = result;
        if( type === 1){
            new Result({
                username:username,
                token:result.data.token,
                expires:result.data.expires
            },msg).success(res)
        }else{
            new Result([], msg).fail(res)
        }
        
    }).catch((error)=>{
        new Result([], error).error(res)
        console.log("catch route/admin/index.js:", error)
    })
    
})



module.exports = router

