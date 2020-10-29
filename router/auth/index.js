const router = require("express").Router()
const callback = require("./callback")
router.get("/",(req,res)=>{
    res.send("TODO")
})

router.get("/callback",callback)

module.exports = router