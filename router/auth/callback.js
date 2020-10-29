module.exports = async function(req,res){
    const fetch = require("node-fetch")
    const toUrlEncoded = obj => Object.keys(obj).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(obj[k])).join('&');
    const client_secret = process.env.SPOTIFY_SECRET
    const client_id = process.env.SPOTIFY_ID

    const url = "https://accounts.spotify.com/api/token"
    const options = {
        method: "POST",
        body: toUrlEncoded({
            grant_type:"authorization_code",
            code:req.query.code,
            redirect_uri:"http://localhost:3000/auth/callback",
            client_id:client_id,
            client_secret:client_secret
        }),
        headers:{
            // "Authorization": `Basic ${btoa(client_id)}:${btoa(client_secret)}`,
            "Content-Type": "application/x-www-form-urlencoded",
        }
    }
    return fetch(url,options)
    .then(res=>res.json())
    .then(results=>{
        res.cookie("spotify_access_token",results.access_token,{expires:new Date(Date.now() + (results.expires_in*1000))})
        res.cookie("spotify_refresh_token",results.refresh_token)
        return res.redirect("http://localhost:3001/")
    })
    .catch(err=>{
        const message = `CALLBACK FAILED - ${err}`
        if(err)console.log(message)
        return res.send(message)
    })

    
}