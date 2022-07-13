// let dev = {
//     'dbInfo':{
//         connectionLimit: 2000,
//         host: '1.117.74.41',
//         user: 'lab',
//         password: 'lab',
//         database: 'lab',
//         insecureAuth: true
//     }
// }

let dev = {
    'dbInfo':{
        connectionLimit: 2000,
        host: '47.97.252.179',
        user: 'lab',
        password: 'smyxDAeLxE4TwLPK',
        database: 'lab_test',
        insecureAuth: true
    }
}

let responseType = {
    CODE_SUCCESS: 2000,
    CODE_FAIL: 2001,
    CODE_ERROR:4000,
}

let jwt_options = {
    PRIVATE_KEY: "als234ja1h995her",
    EXPIRES: 60*60*24*3
}

module.exports = {
    dev, responseType, jwt_options
}
