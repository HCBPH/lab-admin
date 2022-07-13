const {queryDB} = require("../../config/db")


async function findOneStore(sid){

    sid = parseInt(sid)

    let sql = "select * from STORE_INFO where is_delete=0 and id=?"

    try {
        const result = await queryDB(sql, [sid])
        if(result.length === 0){
            return await Promise.reject("记录不存在");
        }else {
            return await Promise.resolve(result[0])
        }
    }catch (error) {
        return await Promise.reject(error.errorType || error)
    }
}


async function findStorePage(page, size){

    page = parseInt(page)
    size = parseInt(size)

    let sql = "select * from STORE_INFO where is_delete=0 order by id desc limit ?,?"

    try {
        const result = await queryDB(sql, [(page-1)*size, size])
        if(result.length === 0){
            return await Promise.reject("记录不存在");
        }else {
            return await Promise.resolve(result)
        }
    }catch (error) {
        return await Promise.reject(error.errorType || error)
    }
}


async function createStore(store){

    let sql = "INSERT INTO STORE_INFO(name, cover, background, introduce, detail, picture, score, consume, location, address, business_hours, tel, `style`, `type`, update_time, spare)VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now(), ?)"

    try {
        const result = await queryDB(sql, [
            store.name, store.cover, store.background, store.introduce,
            store.detail, store.picture, store.score, store.consume, store.location,
            store.address, store.business_hours, store.tel,
            store.style, store.type, store.spare
        ])
        if(result.affectedRows === 0){
            return await Promise.reject("创建失败");
        }else {
            return await Promise.resolve("创建成功")
        }
    }catch (error) {
        return await Promise.reject(error.errorType || error)
    }
}


async function editStore(store){

    let sql = "UPDATE STORE_INFO SET name=?, cover=?, background=?, introduce=?, detail=?, picture=?, score=?, consume=?, location=?, address=?, business_hours=?, tel=?, `style`=?, `type`=?, update_time=now(), spare=? WHERE id=?"

    try {
        const result = await queryDB(sql, [
            store.name, store.cover, store.background, store.introduce,
            store.detail, store.picture, store.score, store.consume, store.location,
            store.address, store.business_hours, store.tel,
            store.style, store.type, store.spare, store.id
        ])
        if(result.changedRows === 0){
            return await Promise.reject("记录不存在");
        }else {
            return await Promise.resolve("修改成功")
        }
    }catch (error) {
        return await Promise.reject(error.errorType || error)
    }
}



async function deleteStore(sid) {

    sid = parseInt(sid)

    let sql = "update STORE_INFO set is_delete=1 where id=?"
    
    try {
        const result = await queryDB(sql, [sid])
        if(result.changedRows === 0){
            return await Promise.reject("请勿重复删除记录")
        }else{
            return await Promise.resolve("成功删除记录")
        }
    }catch (e) {
        return await Promise.reject(e.errorType||e)
    }

}



module.exports = {
    findOneStore,
    findStorePage,
    createStore,
    editStore,
    deleteStore
}


