const {queryDB} = require("../../config/db")


async function findOneRecommend(rid){

    rid = parseInt(rid)

    let sql = "select * from RECOMMEND_INFO where id=?"

    try {
        
        const result = await queryDB(sql, [rid])

        if(result.length === 0){
            return await Promise.reject("记录不存在")
        }else {
            return await Promise.resolve(result[0])
        }

    }catch (e) {
        return await Promise.reject(e.errorType||e)
    }

}


async function findRecommendPage(page, size){

    page = parseInt(page)
    size = parseInt(size)

    let sql = "select * from RECOMMEND_INFO order by id desc limit ?,?"

    try {
        
        const result = await queryDB(sql, [(page-1)*size, size])

        if(result.length === 0){
            return await Promise.resolve([])
        }else {
            return await Promise.resolve(result)
        }

    }catch (e) {
        return await Promise.reject(e.errorType||e)
    }

}




async function editRecommend(recommend) {

    let sql = "UPDATE RECOMMEND_INFO SET publisher=?, cover=?, title=?, brief=?, content=?, picture=?, tag=?, background=?, `time`=now() WHERE id=?"
    
    try {
        const result = await queryDB(sql, [recommend.publisher, recommend.cover, recommend.title, recommend.brief, recommend.content, recommend.picture, recommend.tag, recommend.background, parseInt(recommend.id)])
        if(result.changedRows===0){
            return await Promise.reject("记录不存在")
        }else{
            return await Promise.resolve("更新成功")
        }
    }catch (e) {
        return await Promise.reject(e.errorType||e)
    }

}



async function createRecommend(recommend) {

    let sql = "INSERT INTO RECOMMEND_INFO (publisher, cover, title, brief, content, picture, tag, background) VALUES(?, ?, ?, ?, ?, ?, ?, ?)"
    
    try {
        const result = await queryDB(sql, [recommend.publisher, recommend.cover, recommend.title, recommend.brief, recommend.content, recommend.picture, recommend.tag, recommend.background])
        console.log(result)
        if(result.affectedRows===0){
            return await Promise.reject("创建失败")
        }else{
            return await Promise.resolve(result.insertId)
        }
    }catch (e) {
        return await Promise.reject(e.errorType||e)
    }

}


async function deleteRecommend(rid) {

    rid = parseInt(rid)

    let sql = "update RECOMMEND_INFO set is_delete=1 where id=?"
    
    try {
        const result = await queryDB(sql, [rid])
        if(result.changedRows === 0){
            return await Promise.reject("请勿重复删除记录")
        }else{
            return await Promise.resolve("成功删除记录")
        }
    }catch (e) {
        return await Promise.reject(e.errorType||e)
    }

}



async function recoverRecommend(rid) {

    rid = parseInt(rid)

    let sql = "update RECOMMEND_INFO set is_delete=0 where id=?"
    
    try {
        const result = await queryDB(sql, [rid])
        if(result.changedRows === 0){
            return await Promise.reject("请勿重复操作")
        }else{
            return await Promise.resolve("成功恢复记录")
        }
    }catch (e) {
        return await Promise.reject(e.errorType||e)
    }

}



module.exports = {
    findOneRecommend,
    findRecommendPage,
    createRecommend,
    editRecommend,
    deleteRecommend,
    recoverRecommend
}
