require("dotenv").config()
const express = require("express")
const app = express()
const port = parseInt(process.env.PORT) || 2000
const fs =require("fs")
const cookieParser = require('cookie-parser')
const cors = require("cors")

// Modules
app.use(cors())
app.use(cookieParser())

// Routers
const routerPath = process.env.PWD+"/router"
fs.readdirSync(routerPath).forEach(dir=>{
    const router = require(`${routerPath}/${dir}`)
    app.use(`/${dir}`,router)
})

// Set Query Parser
// Redundant, As simple Is Default
app.set("query parser","simple")

// Spin Up Server
app.listen(port,()=>{
    console.log("listening @",port)
})

// Debug
app.get("/:a?",(req,res)=>{
    res.send(req.query)
})


