const router = require("express").Router()
const callback = require("./callback")
const auth = require("./auth")

router.get("/callback",callback)
router.get("/",auth)

module.exports = router