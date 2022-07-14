const {queryDB} = require("../../config/db")


async function checkUser(uid){
    let sql = "select id,username from USER where id=? and is_delete=0"
    try {
        const result = await queryDB(sql, [uid])
        // console.log(result)
        return await Promise.resolve(result)
    } catch (error) {
        return await Promise.reject(error)
    }
}

async function editUserInfo(userInfo){
    let sql = "update USER set name=?,email=?,tel=?,birthday=?,sex=? where id=? and is_delete=0"

    // 先判断user是否存在
    let exists = await checkUser(userInfo.uid).then((res)=>{
        console.log(res)
        if(res.length === 0){
            return false
        }else {
            return true
        }
    }).catch((error)=>{
        return false
    })

    try {
        if(exists){
            const result = await queryDB(sql, [userInfo.name, userInfo.email,
                userInfo.tel,userInfo.birthday,userInfo.sex,userInfo.uid
            ])
            // console.log(result)
            // 这里需要对result.changedRows进行判断，1
            let isSuccess = result.changedRows
            if (isSuccess){
                return await Promise.resolve()
            }else{
                return await Promise.reject("状态已修改，请勿重复操作")
            }
        }else {
            return await Promise.reject("用户不存在")

        }
    } catch (error) {
        return await Promise.reject(error.errorType||error)
    }
}

async function editUserState(uid, state){

    let sql = "update USER set state=? where id=? and is_delete=0"

    // 先判断user是否存在
    let exists = await checkUser(uid).then((res)=>{
        console.log(res)
        if(res.length === 0){
            return false
        }else {
            return true
        }
    }).catch((error)=>{
        return false
    })

    try {
        if(exists){
            const result = await queryDB(sql, [state, uid])
            // 这里需要对result.changedRows进行判断，1
            let isSuccess = result.changedRows
            if (isSuccess){
                return await Promise.resolve()
            }else{
                return await Promise.reject("状态已修改，请勿重复操作")
            }
        }else {
            return await Promise.reject("用户不存在")

        }
    } catch (error) {
        return await Promise.reject(error.errorType||error)
    }
}

async function findUserByID(uid){
    sql = "select id,username,name,email,tel,birthday,sex,create_time,last_login_time,profile,state from USER where id=? and is_delete=0"

    try {
        const result = await queryDB(sql, [uid])
        return await Promise.resolve(result[0])
    } catch (error) {
        return await Promise.reject(error.errorType||error)
    }
}

async function findUsersByPage(page, size, sort){

    page = parseInt(page)
    size = parseInt(size)

    sql = "select id,username,name,email,tel,birthday,sex,create_time,last_login_time,profile,state from USER where is_delete=0 order by id "+sort+" limit ?, ?"

    try {
        const result = await queryDB(sql, [(page-1)*size, size])
        return await Promise.resolve(result)
    }catch (error) {
        return await Promise.reject(error.errorType||error)
    }

}



async function deleteUser(uid){
    uid = parseInt(uid)

    sql = "update USER set is_delete=1 where id=?"

    try {
        const result = await queryDB(sql, [uid])
        if(result.changedRows === 0){
            return await Promise.reject("用户已删除，请勿重复操作")
        }else{
            return await Promise.resolve("成功删除用户")
        }
    }catch(error){
        return await Promise.reject(error.errorType||error)
    }
}


async function recoverUser(uid){
    uid = parseInt(uid)

    sql = "update USER set is_delete=0 where id=?"

    try {
        const result = await queryDB(sql, [uid])
        if(result.changedRows === 0){
            return await Promise.reject("请勿重复操作")
        }else{
            return await Promise.resolve("成功恢复用户")
        }
    }catch(error){
        return await Promise.reject(error.errorType||error)
    }
}


module.exports = {
    findUserByID,
    findUsersByPage,
    editUserState,
    editUserInfo,
    checkUser,
    deleteUser,
    recoverUser
}


