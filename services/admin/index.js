const {queryDB} = require("../../config/db")
const jwt = require("jsonwebtoken")
const {jwt_options} = require("../../config/env")


function login(username, password){
    // console.log(username, password)
    return checkUser(username).then((results)=>{
        const {uname, passwd} = results[0]
        if (passwd === password){

            const token = jwt.sign({
                username:username,
            }, jwt_options.PRIVATE_KEY, {expiresIn:jwt_options.EXPIRES})

            return Promise.resolve({type:1, msg:"登录成功", data:{
                username:uname,
                token: token,
                expires:jwt_options.EXPIRES
            }})

        }else {
            return Promise.resolve({
                type:0,
                msg:"密码错误"
            })
        }
    }).catch((error)=>{
        return Promise.resolve({
            type:0,
            msg:error
        })
    })
}

function checkUser(username){
    const sql = "select username, passwd from T_ADMIN where username=? and is_delete=0"
    return queryDB(sql, username).then(
        (res)=>{
            if(res.length === 0){
                return Promise.reject("用户不存在")
            }else {
                return Promise.resolve(res);
            }
        }
    )
}


function register(user){
    const{username, password, alias, auth} = user
    if (auth == undefined){
        auth = 0
    }
    const sql = "insert into T_ADMIN(username, passwd, alias, auth, create_time) values(?, ?, ?, ?, null)"
    return queryDB(sql, [username, password, alias, auth]).then(
        (res)=>{
            const token = jwt.sign({
                username:username,
            }, jwt_options.PRIVATE_KEY, {expiresIn:jwt_options.EXPIRES})

            console.log("then /services/admin/index.js:创建用户user", [username, password, alias, auth])

            return Promise.resolve({type:1, msg:"注册成功!", data:{
                username:username,
                token: token,
                expires:jwt_options.EXPIRES
            }})

        }
    ).catch(({errorType, errorMsg})=>{
        console.log("catch services/admin/index.js:", errorType, errorMsg)
        return Promise.resolve({type:0, msg:errorType})
    })

}

// 对于controller层，将返回三种结果，success|fail|error, 分别表示操作执行成功，操作（因不符合要求的返回）失败，操作（在系统当中未知的）异常
// services层对promise作预处理，对于成功的操作success不用说，fail和error的区别在于，services层尽可能的捕获这些错误，逻辑能处理的归为fail，未知的将error传递下去，让controller自己catch


module.exports = { login, register, checkUser }


