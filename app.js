require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});
  
// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get("/home",(req,res,next)=>{
    res.render("home.hbs")
})

app.get("/artist-search",(req,res,next)=>{
    console.log(req.query)
    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            console.log('The received data from the API: ', data.body.artists.items[0].images);
            const artists = data.body.artists.items
            res.render("artist-search-results",{artists})
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})


app.get("/albums/:id", async (req,res,next)=>{
    try{
        const id = req.params.id
        const {body:artist} = await spotifyApi.getArtist(id)
        const {body:{items}} = await spotifyApi.getArtistAlbums(id)
        console.log(items)
        console.log(items[0].images)
        res.render("albums",{albums:items,artist})
    }
    catch(e){
        console.log('The error while searching artist occurred: ', e);
    }
})

app.get("/albums/tracks/:id", async (req,res,next)=>{
    try{
        const id = req.params.id
        const {body:{items}} = await spotifyApi.getAlbumTracks(id)
        console.log(items)
        res.render("tracks",{tracks:items})
    }
    catch(e){
        console.log('The error while searching artist occurred: ', e);
    }
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
