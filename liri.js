require("dotenv").config();

var keys = require("./keys.js");

var Spotify = require("node-spotify-api");

var axios = require("axios");

var fs = require("fs");

var moment = require("moment");

var spotify = new Spotify(keys.spotify);

var userTypeQuery = process.argv[2];

var userInput = process.argv[3];

for(var i = 4; i < process.argv.length; i++){
userInput += " " + process.argv[i];
};

function spottie () {
    
    spotify.search({ type: 'track', query: userInput, limit: 1 }).then(function(response) {
        //Spotify Search Query
        var spot = response.tracks.items[0];
        //Band Name
        console.log("Band Name: " + spot.album.artists[0].name);
        //Title of Song
        console.log("Song Title: " + spot.name);
        //Preview Link
        console.log("Preview Link: " + spot.preview_url);
        //Album 
        console.log("Album: " + spot.album.name);
        }).catch(function(err) {
        console.log(err);
        });
};

function bands () {
    axios.get("https://rest.bandsintown.com/artists/" + userInput + "/events?app_id=codingbootcamp")
        .then(function (response) {

        for(var i = 0; i < response.data.length; i++){
            //Separator
            console.log("________________________________________________");
            //Venue Name
            console.log("Name of Venue: " + response.data[i].venue.name);
            //Country 
            console.log("Country: " + response.data[i].venue.country);
            //City
            console.log("City: " + response.data[i].venue.city);
            //Date of Event
            console.log("Date: " + moment(response.data[i].datetime).format("MM/DD/YYYY"));
            if(i == (response.data.length - 1)){
                console.log("________________________________________________");
            }
        };

        }).catch(function (error) {
        console.log(error);
        });
};

function movieThis () {

        axios.get("https://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=trilogy")
        .then(function (response) {
            console.log("Title: " + response.data.Title);
            console.log("Year: " + response.data.Year);
            console.log("IMDB Rating: " + response.data.imdbRating);
            console.log("Rotten Tomatoes: " + response.data.Ratings[1].Value);
            console.log("Country of Production: " + response.data.Country);
            console.log("Language of the Movie: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
        }).catch(function (error) {
            console.log(error);
        });
};

function doWhatItSays () {

        fs.readFile("random.txt", "utf8", function(error, data) {
            if (error) {return console.log(error);};
            var dataArr = data.split(",");   
            userInput = dataArr[1];
            switch (dataArr[0]){
                case "spotify-this-song":
                spottie();
                break;
                case "concert-this":
                bands();
                break;
                case "movie-this":
                movieThis();
                break;
            };
        });
};


switch(userTypeQuery){

    case "spotify-this-song":
        spottie();
        break;
    case "concert-this":
        bands();
        break;
    case "movie-this":
        movieThis();
        break;
    case "do-what-it-says":
        doWhatItSays();
        break;
    default: 
        console.log("--VALID COMMANDS INCLUDE-- ");
        console.log("node liri.js concert-this <artist/band name here>");
        console.log("node liri.js spotify-this-song <song name here>");
        console.log("node liri.js movie-this <movie name here>");
        console.log("node liri.js do-what-it-says");
}
