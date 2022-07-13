const env = require("./env")


class Result{
    constructor(data, message="", options){
        this.data = null
        if(arguments.length === 0){
            this.data = []
            this.message = "无结果"
        }else if(arguments.length === 1){
            this.data = data
        }else{
            this.data = data
            this.message = message
        }

        if(options){
            this.options = options
        }
    }

    createResult(){
        let base = {
            code: this.code,
            message: this.message,
            data: this.data
        }

        if(this.options){
            base = {...base, ...this.options}
        }

        return base;
    }

    json(res){
        res.json(this.createResult())
    }

    success(res){
        this.code = env.responseType.CODE_SUCCESS
        this.json(res)
    }

    fail(res){
        this.code = env.responseType.CODE_FAIL
        this.json(res)
    }

    error(res){
        this.code = env.responseType.CODE_ERROR
        this.json(res)
    }

    jwtError(res){
        this.code = env.responseType.CODE_ERROR
        this.json(res)
    }
}


module.exports = {Result}
