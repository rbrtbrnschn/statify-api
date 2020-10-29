const throwing = false
const apiPort = parseInt(process.env.PORT) || 3000

// Router-Side Config
module.exports = {
    need_throw : throwing,
    database:{
        url: `http://localhost:${apiPort+2}/tracks`
    }
}