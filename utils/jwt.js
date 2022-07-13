
const {expressjwt} = require("express-jwt")
const {jwt_options} = require("../config/env")


module.exports = expressjwt({
    secret: jwt_options.PRIVATE_KEY,
    algorithms: ['HS256'],
}).unless({
    path: [
        "/",
        "/admin/login",
        "/admin/register"
    ]
})