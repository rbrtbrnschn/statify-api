const isProduction = false
module.exports = {
    domain:!isProduction ? "http://localhost:8080" : "https://statify.rbrtbrnschn.dev",
    api: !isProduction ? "http://localhost:8081/api" : "https://statify.rbrtbrnschn.dev/api"
}