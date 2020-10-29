class Track {
    constructor(req,res){
        this.req = req
        this.res = res
    }
    
    async exec(){
        const fetch = require("node-fetch")
        const {query} = this.req
        let TOKEN = query.spotify_access_token
        const COOKIE = this.req.cookies["spotify_access_token"]

        // Error Handling
        let willError =false
        if(!TOKEN) willError = true
        /* TODO
            Enable When Testing With Client
            if(!COOKIE) willError = true
            else if(COOKIE) {willError = true; TOKEN=COOKIE}
        */

        if(willError) throw new Error("MISSING SPOTIFY TOKEN")
    
        // name Can Be Anything But Artist
        // Simply Set Type To What Name Is
        const type = query.type || "track"
        const name = query.name || "Watermelon Sugar"
        const artist = query.artist || "Harry Styles"
    
        const _name = name.split(" ").join("%20")
        const _artist = artist.split(" ").join("%20")
    
        // Hopefully Works As Intended
        // If Search Query Is Undefined Somewhere
        // Throw Error Basically
        Object.values(query).forEach(e=>{
            if(e=="undefined") return this.res.json({
                error:true,
                body:{
                    msg:"Some query parameter was either undefined or corrupted",
                     query: query
                    }
            })
        })
        
        // Assemble Url
        const base = "https://api.spotify.com/v1"
        const method = "search"
        const args = `?q=${type}:${_name}%20artist:${_artist}&type=${type}&limit=1`
        const url = `${base}/${method}${args}`
    
        // Fetch
        const options = {
            headers:{
                "Authorization": `Bearer ${TOKEN}`,
                "Accept":"application/json",
                "Content-Type":"application/json"
            }
        }
        return fetch(url,options)
        .then(response=>response.json())
        .then(response=>{
            // Error Handling
            if(response.error)return this.res.json({error:true,body:response.error})

            return this.res.json(response)
        })
        .catch(err=>{
            if(err)throw new Error(err)
            return this.res.send("Errored.")
        })
    
    }

    information(){
        return {
            endpoint:'/v1/track',
            information: "Something herer"
        }
    }
}


module.exports = Track