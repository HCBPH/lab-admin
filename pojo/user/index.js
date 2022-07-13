const e = require("express")

class User{

}


class UserInfo{
    constructor(id, name, email, tel, birthday, sex){
        this.id = id
        this.name = name
        this.email = email
        this.tel = tel
        this.birthday = birthday
        this.sex = sex
    }
}


module.exports = {User, UserInfo}
