const {queryDB} = require("../../config/db")


async function findOneTopic(tid) {

    tid = parseInt(tid)

    let sql = "select * from TOPIC_INFO where id=? and is_delete=0"
    
    try {
        const result = await queryDB(sql, [tid])
        if(result.length===0){
            return await Promise.reject("记录不存在")
        }else{
            return await Promise.resolve(result[0])
        }
    }catch (e) {
        return await Promise.reject(e.errorType||e)
    }

}


async function findTopicPage(page, size) {

    page = parseInt(page)
    size = parseInt(size)

    let sql = "select * from TOPIC_INFO where is_delete=0 order by id desc limit ?,?"
    
    try {
        const result = await queryDB(sql, [(page-1)*size, size])
        if(result.length===0){
            return await Promise.resolve([])
        }else{
            return await Promise.resolve(result)
        }
    }catch (e) {
        return await Promise.reject(e.errorType||e)
    }

}


async function editTopic(topic) {

    let sql = "UPDATE TOPIC_INFO SET publisher=?, cover=?, title=?, brief=?, content=?, picture=?, tag=?, background=?, `time`=now() WHERE id=? and is_delete=0"
    
    try {
        const result = await queryDB(sql, [topic.publisher, topic.cover, topic.title, topic.brief, topic.content, topic.picture, topic.tag, topic.background, parseInt(topic.id)])
        if(result.changedRows===0){
            return await Promise.reject("记录不存在")
        }else{
            return await Promise.resolve("更新成功")
        }
    }catch (e) {
        return await Promise.reject(e.errorType||e)
    }

}



async function createTopic(topic) {

    let sql = "INSERT INTO TOPIC_INFO (publisher, cover, title, brief, content, picture, tag, background) VALUES(?, ?, ?, ?, ?, ?, ?, ?)"
    
    try {
        const result = await queryDB(sql, [topic.publisher, topic.cover, topic.title, topic.brief, topic.content, topic.picture, topic.tag, topic.background])
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


async function deleteTopic(tid) {

    tid = parseInt(tid)

    let sql = "update TOPIC_INFO set is_delete=1 where id=?"
    
    try {
        const result = await queryDB(sql, [tid])
        if(result.changedRows === 0){
            return await Promise.reject("请勿重复删除记录")
        }else{
            return await Promise.resolve("成功删除记录")
        }
    }catch (e) {
        return await Promise.reject(e.errorType||e)
    }

}



async function recoverTopic(tid) {

    tid = parseInt(tid)

    let sql = "update TOPIC_INFO set is_delete=0 where id=?"
    
    try {
        const result = await queryDB(sql, [tid])
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
    findOneTopic,
    findTopicPage,
    createTopic,
    editTopic,
    deleteTopic,
    recoverTopic
}


