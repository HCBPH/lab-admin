
const env = require("./env")
const mysql = require("mysql")
const { prototype } = require("boom")

let pool = mysql.createPool(env.dev.dbInfo)

function queryDB(sql, params="") {
    return new Promise((resolve, reject)=>{
        pool.getConnection(function(err, conn){
            if(err){
                reject("ERROR_CONNECTION", "数据库连接失败:"+err)
            }else {
                conn.query(sql, params, function(err, results){
                    if(err){
                        console.log(">>>config/db.js: 查询异常:"+err)
                        reject({
                            errorType:"ERROR_QUERY",
                            errorMsg:"查询异常:"+err
                        })
                    }else {
                        resolve(results)
                    }
                })
                pool.releaseConnection(conn)
            }
        })
    })
}

module.exports = {queryDB}

