
const {queryDB} = require("../../config/db")



async function findOneAccuse(aid) {
    try {

        let sql = "select * from ACCUSE_INFO where id=?"

        const result = await queryDB(sql, [aid])

        // console.log(result)
        if(result.length === 0){
            return await Promise.reject("记录不存在")
        }else {
            return await Promise.resolve(result[0])
        }

    }catch (e) {
        return await Promise.reject(e.errorType||e)
    }
}


async function findAccusePage(page, size) {
    try {
        
        page = parseInt(page)
        size = parseInt(size)

        let sql = "select id, time, type, accuser, accused, cid, reason, state, feedback from ACCUSE_INFO order by id desc limit ?, ?"

        const result = await queryDB(sql, [(page-1)*size, size])

        // console.log(result)
        if(result.length === 0){
            return await Promise.reject("投诉记录为空")
        }else {
            return await Promise.resolve(result)
        }

    }catch (e) {
        return await Promise.reject(e.errorType||e)
    }
}


async function findProcessedAccusePage(page, size) {
    try {

        page = parseInt(page)
        size = parseInt(size)

        let sql = "select * from ACCUSE_INFO where state!=0 order by id desc limit ?, ?"

        const result = await queryDB(sql, [page, size])

        // console.log(result)
        if(result.length === 0){
            return await Promise.reject("记录不存在")
        }else {
            return await Promise.resolve(result)
        }

    }catch (e) {
        return await Promise.reject(e.errorType||e)
    }
}


async function findUnprocessedAccusePage(page, size) {
    try {

        page = parseInt(page)
        size = parseInt(size)

        let sql = "select * from ACCUSE_INFO where state=0 order by id desc limit ?, ?"

        const result = await queryDB(sql, [page, size])

        // console.log(result)
        if(result.length === 0){
            return await Promise.reject("记录不存在")
        }else {
            return await Promise.resolve(result)
        }

    }catch (e) {
        return await Promise.reject(e.errorType||e)
    }
}


async function findAccuseByAccused(username) {
    try {

        let sql = "select * from ACCUSE_INFO where accused=?"

        const result = await queryDB(sql, [username])

        // console.log(result)
        if(result.length === 0){
            return await Promise.reject("记录不存在")
        }else {
            return await Promise.resolve(result[0])
        }

    }catch (e) {
        return await Promise.reject(e.errorType||e)
    }
}


async function findAccuseByAccuser(username) {
    try {
        // console.log(username)

        let sql = "select * from ACCUSE_INFO where accuser=?"

        const result = await queryDB(sql, [username])

        // console.log(result)
        if(result.length === 0){
            return await Promise.reject("记录不存在")
        }else {
            return await Promise.resolve(result)
        }

    }catch (e) {
        return await Promise.reject(e.errorType||e)
    }
}


async function findAccuseByCid(cid) {
    try {

        cid = parseInt(cid)

        let sql = "select * from ACCUSE_INFO where cid=?"

        const result = await queryDB(sql, [cid])

        // console.log(result)
        if(result.length === 0){
            return await Promise.reject("记录不存在")
        }else {
            return await Promise.resolve(result)
        }

    }catch (e) {
        return await Promise.reject(e.errorType||e)
    }
}



async function processAccuse(aid, state, feedback) {
    try {
        aid = parseInt(aid)
        state = parseInt(state)

        let sql = "update ACCUSE_INFO set state=?,feedback=? where id=?"

        const result = await queryDB(sql, [state, feedback, aid])
        
        console.log(result)
        if(result.changedRows === 0){
            return await Promise.reject("请勿重复修改")
        }else {
            return await Promise.resolve("修改成功")
        }

    }catch (e) {
        return await Promise.reject(e.errorType||e)
    }
}


async function deleteAccuse(aid){

    aid = parseInt(aid)

    let sql = "update ACCUSE_INFO set is_delete=1 where id=?"

    try {

        const result = await queryDB(sql, [aid])

        if(result.changedRows === 0){
            console.log("aaaaaaaaaa")
            return await Promise.reject("请勿重复删除")
        }else{
            return await Promise.resolve("成功删除投诉")
        }


    }catch(e){
        return await Promise.reject(e.errorType||e)
    }

}



async function recoverAccuse(aid){

    aid = parseInt(aid)

    let sql = "update ACCUSE_INFO set is_delete=0 where id=?"

    try {

        const result = await queryDB(sql, [aid])

        if(result.changedRows === 0){
            console.log("aaaaaaaaaa")
            return await Promise.reject("请勿重复操作")
        }else{
            return await Promise.resolve("成功恢复投诉")
        }


    }catch(e){
        return await Promise.reject(e.errorType||e)
    }

}



module.exports = {
    findOneAccuse,
    findProcessedAccusePage,
    findUnprocessedAccusePage,
    findAccusePage,
    findAccuseByAccuser,
    findAccuseByAccused,
    findAccuseByCid,
    processAccuse,
    deleteAccuse,
    recoverAccuse
}