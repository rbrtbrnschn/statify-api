const router = require("express").Router()
const fs = require("fs")
const commandsPath = `${process.env.PWD}/router/v1/commands`

const started = Date.now()

// List Commands
router.get("/",(req,res)=>{
    // Get File Names
    const commandsFiles = fs.readdirSync(commandsPath)

    // Get Endpoint Information
    // TODO Wait for Reddit answers
    // TODO turn into one liner, removing curlies
    const endpointInformation = commandsFiles.map(e=>{
        const Command = require(`${commandsPath}/${e}`)
        return new Command().information()
    })

    return res.json(endpointInformation)
})


// Debug Get Query
router.get("/query",(req,res)=>{
    return res.json(req.query)
})

// Execute Command
router.get("/:command",(req,res)=>{
    const {command} = req.params
    
    try{
        // const _command = require(`${commandsPath}/${command}`)
        // return _command(req,res)
        const Command = require(`${commandsPath}/${command}`)
        const _command = new Command(req,res)
        return _command.exec()
    }
    catch(err){
        const {need_throw} = require("./config")

        // Added Reduncany For Increased Readability
        const needsThrowing = need_throw
        const message = `FAILED EXECUTION - ${command} - ${err}`
        if(needsThrowing) throw new Error(message)

        return res.send(message)
    }
})

// Trap Handler
// function exitHandler(options, exitCode){
    // if(options.cleanup) console.log(options)
    // if(exitCode || exitCode === 0) console.log(exitCode)
    // if(options.exit) process.exit()
//     console.log(`Lifecycle Uptime: ${Math.floor(Math.abs((started-Date.now())/3600000))}h`)
// }

// Handle When App Closes Properly | Should Not Occur
// process.on('exit', exitHandler.bind(null,{cleanup:true}));

// // Handles SIGINT (ctrl+c)
// process.on("SIGINT",exitHandler.bind(null, {exit:true}));
// // Handles SIGKILL (kill PID) or nodemon restart
// process.on("SIGUSR1",exitHandler.bind(null, {exit:true}));
// process.on("SIGUSR2",exitHandler.bind(null, {exit:true}));

// // Catches Uncaught Exceptions
// process.on('uncaughtException', exitHandler.bind(null, {exit:true}));


module.exports = router
