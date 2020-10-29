module.exports = function(req,res){
    const config = require("./config")

    const redirect_uri = `${config.api}/auth/callback`
    console.log(redirect_uri)
    // const redirect_uri = "http://localhost:8081/auth/callback"
    var scopes = "ugc-image-upload playlist-modify-public playlist-read-private playlist-modify-private playlist-read-collaborative app-remote-control streaming user-read-playback-position user-read-currently-playing user-modify-playback-state user-library-read user-library-modify user-read-private user-read-email"
    const url = `https://accounts.spotify.com/authorize?response_type=code&client_id=${process.env.SPOTIFY_ID}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirect_uri)}`

    return res.redirect(url)
}