var express = require('express');
const { Result } = require('../config/result');
var router = express.Router();
const helper = require('../utils/helper')

const jwt = require('../utils/jwt')

const boom = require('boom')


// router.use(jwt)


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


// 遍历导入路由
const scanResult  = helper.scanDirModules(__dirname, __filename)
for(const prefix in scanResult){
  if (scanResult.hasOwnProperty(prefix)){
    router.use(prefix, scanResult[prefix])
  }
}


router.use((err, res, next)=>{
  next(boom.notFound())
})

router.use((err, req, res, next)=>{
  console.log("routes/index.js: ", err)
  if(err.name && err.name === 'UnauthorizedError'){
    const{status = 401, message} = err
    new Result(null, "token失效", {
      error: status,
      errorMsg: message,
    }).jwtError(res.status(status))
  }else {
    const msg = (err&&err.message)||'系统错误'
    const statusCode = (err.output && err.output.statusCode)||500
    const errorMsg = (err.output.payload && err.output && err.output.payload.error) || err.message
    new Result(null, msg, {
      statusCode: statusCode,
      errorMsg
    }).fail(res.status(statusCode))
  }

})

module.exports = router;
