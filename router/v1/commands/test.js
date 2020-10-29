class Test {
    constructor(req,res){
        this.req = req
        this.res = res
    }
    exec(){
        return this.res.send("Tested: '/v1/test'")
    }
    information(){
        return {
            endpoint:'/v1/test',
            information:"Not sure, just testing"
        }
    }

}
module.exports = Test