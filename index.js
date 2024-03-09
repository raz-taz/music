const express = require('express')
const app = express()
const querystring = require('querystring')
const { generateRandomString } = require('./plugins')
const axios = require('axios').default
const port = 3002
const host = "192.168.3.204"

const CLIENT_ID = "93c005e438934a36a2251e24c1fc46dc"
const CLIENT_SECRET = "15220f9897e847988dc0f7125b943976"

const scopes = [
    "user-read-currently-playing",
    "user-read-recently-played",
    "user-read-private",
    "user-read-playback-state"
]


const tokenEndpoint = "https://accounts.spotify.com/api/token"
const REDIRECT_URI = "https://music-vbfd.onrender.com//callback"

app.get('/', function (req, res){
    res.send("Server's up!");
});

app.get('/login', function (req, res) {
    res.redirect(`https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${scopes.join("%20")}&response_type=code&show_dialog=true`)
});
app.get('/callback', function (req, res) {

    const code = req.query.code || null;


    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        data: {
            code: code,
            redirect_uri: REDIRECT_URI,
            grant_type: 'authorization_code'
        },
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (new Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
        },
        json: true
    };
    axios.post(authOptions.url, authOptions.data, { headers: authOptions.headers }).then((val) => {
        let data = val.data;
        data.status = 200
        res.send(data)
    }).catch(err=>{
        res.send(err)
    })

});

 

app.listen(port, () => {
    console.log(`Working..`)
})
