const { need_throw } = require("../config")
const fetch = require("node-fetch")

class History {
    constructor(req,res){
        this.req = req
        this.res = res
    }
    async exec(){
        
        const TOKEN = process.env.LASTFM_TOKEN

        // Error Handling
        if(!TOKEN)throw new Error("MISSING LAST.FM TOKEN")

        const {query} = this.req
        const user = query.user || "rj"
        const limit = query.limit || 1000
        const page = query.page || 1
        const isRecursive = true
        const needs_post_processing = Object.keys(this.req.query).length > 1

        // Assemble Url
        const base = "http://ws.audioscrobbler.com/2.0"
        const method = "?method=user.getrecenttracks"
        const args = `&api_key=${TOKEN}&user=${user}&limit=${limit}&page=${page}&format=json`
        const url = `${base}/${method}${args}`

        // Get History From Landingpage
        const initial = await this.fetch(url,needs_post_processing)
        if(!isRecursive)return this.res.json(initial)

        // Get Full History
        let pageCounter = initial.recenttracks["@attr"].page
        if(initial.recenttracks["@attr"].page !== initial.recenttracks["@attr"].totalPages){
            let fullHistory = {...initial}
            while(true){
                // Break When Totalpages Has Been Reached
                pageCounter++

                // Fetch
                const nextPageUrl = `http://localhost:${process.env.PORT}/api/v1/history?page=${pageCounter}&limit=1000&user=${user}`
                const nextPageRaw = await fetch(nextPageUrl)
                const nextPage = await nextPageRaw.json()

                // Add To History
                fullHistory.recenttracks.track.push(...nextPage.recenttracks.track)

                // Break If Done
                if(nextPage.recenttracks["@attr"].page === nextPage.recenttracks["@attr"].totalPages)break
                
            }
            return this.res.json(fullHistory)
        }

        return this.res.json(initial)
    }

    fetch(url,needs_post_processing){
        return fetch(url)
        .then(response=>response.json())
        .then(response=>{
            // Got Proper Response

            // Return Post Processed Response
            if(needs_post_processing)return this.postProcess(response)

            // Otherwise Return Raw Response 
            return response
        })
        .catch(err=>{
            // Error Handling
            if(err)throw new Error("HISTORY ERRORED")
        })
    }
    postProcess(response){
        const USP = new URLSearchParams(this.req.query)
    
        if(USP.has("from"))response = this.handleFrom(response,this.req.query)

        // If No Proccessing Methods Found | Return Raw
        // Otherwise Return Processed
        return response
    }

    handleFrom(response,query){
        function isNumeric(str) {
            if (typeof str != "string") return false // we only process strings!  
            return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
                   !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
          }
        function handleFormatting(from){
            // Returns Unix Time Stamp
            const isUnix = isNumeric(from)
            const isFormatted = from.includes("%") || !isUnix
    
            // If JS Timestamp
            if(from.toString().length == 10) return new Date(parseInt(from.toString()+"000")).getTime()
            
            // If UNIX Timestamp
            if(isUnix){ 
                // Unusual Occurance Hence The Log
                console.log("Got Unix Date:",new Date(from))
                return new Date(from).getTime()
            }
            
            // If Formatted
            if(isFormatted){
                const now = new Date()
                
                switch (from) {
                    case "today":
                        now.setHours(0,0,0,0)
                        return now.getTime()
                
                    default:
                        break;
                }
    
            }
            
            
    
            return new Date(from).getTime()
        }
    
        let {from} = query
        from = handleFormatting(from)
        
        const filtered = response.recenttracks.track.filter(t=>{
            // Now Playing
            if(t["@attr"] && t["@attr"].nowplaying === "true")return true
    
            // Corrupt Formatting
            if(!t["date"])return false
            if(!t["date"]["#text"]) return false
            
            const datePlayed = new Date(`${t["date"]["#text"]} UTC`)
    
            // If Date Is Wrong Or Undefined
            if(!datePlayed)return false
            
            return datePlayed.getTime() > from
    
        })
    
        const newResponse = {...response,recenttracks:{...response.recenttracks,track:filtered}}
        return newResponse
    }
    
    information(){
        return {
            endpoint:'/v1/history',
            information:"Not sure look it up."
    }
    }

}

module.exports = History