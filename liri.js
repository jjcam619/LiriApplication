// requires for this project
require("dotenv").config();
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var keys = require('./keys.js');
var request = require('request');
var fs = require('fs');
var moment = require('moment');
moment().format()

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);


// Variables for user input.
var action = process.argv[2];
var name = process.argv.slice(3).join(" ");


// Function that shows your last 20 tweets and when they were created at in your terminal/bash window.
var twitterSearch = function() {
    client.get('statuses/home_timeline', function(error, tweets) {
        if (error) {
            console.log(error);
        }

        for(i = 0; i < tweets.length; i++) {

            // Using moment.js to change time format
            let time = moment(tweets[i].created_at).format("dddd, MMMM Do YYYY, h:mm:ss a");
            console.log(time);
            console.log(tweets[i].text + "\n");
        }
    });
}

//  node liri.js spotify-this-song '<song name here>'
//  Function that shows couple informations about the song input in your terminal/bash window (artist, song name, preview link, album).
// If there is no input, the default song is: The Sign by Ace of Base.
var spotifySearch = function(name) {
    if (name === undefined) {

        spotify.search({ type: 'track', query: "The Sign Ace of Base", limit: 1 }, function(err, data) {
            if (err) {
              return console.log('Error occurred: ' + err);
            }
        
            let artists = "";
            for(i=0; i < data.tracks.items[0].album.artists.length;i++) {
                artists = artists + data.tracks.items[0].album.artists[i].name + "  ";
            }
            console.log("** NO SEARCH TERM **")
            console.log("* Artist(s): " + artists);
            console.log("* Song Name: " + data.tracks.items[0].name);
            console.log("* Link: " + data.tracks.items[0].external_urls.spotify);
            console.log("* Album Name: " + data.tracks.items[0].album.name);
        });
    }
    else {
        spotify.search({ type: 'track', query: name, limit: 1 }, function(err, data) {
            if (err) {
              return console.log('Error occurred: ' + err);
            }
           
            let artists = "";
            for(i=0; i < data.tracks.items[0].album.artists.length;i++) {
                artists = artists + data.tracks.items[0].album.artists[i].name + "  ";
            }
            console.log("* Artist(s): " + artists);
            console.log("* Song Name: " + data.tracks.items[0].name);
            console.log("* Link: " + data.tracks.items[0].external_urls.spotify);
            console.log("* Album Name: " + data.tracks.items[0].album.name);

        });
    }
}

// Function that shows couple informations based on user Input of movie title.
// If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
var movieSearch = function(name) {
    if (name === undefined) {

        let movie = "Mr.Nobody";

        request("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy", function(error, response, body) {

            if (error) {
                console.log(error);
            }

            console.log("Movie Title: " + JSON.parse(body).Title);
            console.log("Movie Year: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
            console.log("Country: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
        });
        
    }
    else {
        request("http://www.omdbapi.com/?t=" + name + "&y=&plot=short&apikey=trilogy", function(error, response, body) {

            if (error) {
                console.log(error);
            }

            console.log("Movie Title: " + JSON.parse(body).Title);
            console.log("Movie Year: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
            console.log("Country: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
        });
    }
}

// Function that uses the fs Node package. This app will take the text inside of random.txt and then use it to call one of LIRI's commands.
var textFileSearch = function() {
    fs.readFile("./random.txt", "utf8", function(error, data) {
        if(error) {
            console.log(error);
        }

        if (data.startsWith("spotify-this-song")) {
            let dataArray = data.split(",");
            let searchTerm = dataArray[1].slice(1,-1);
            spotifySearch(searchTerm);
        }
        else if (data.startsWith("movie-this")) {
            let dataArray = data.split(",");
            let searchTerm = dataArray[1].slice(1,-1);
            movieSearch(searchTerm);
        }
        else if (data.startsWith("my-tweets")) {
            twitterSearch();    
        }
        else {
            console.log("Something is wrong...")
        }
        
    })
}



//  node liri.js my-tweets
if (action === "my-tweets") {
    twitterSearch();
}
//  node liri.js spotify-this-song '<song name here>'
else if (action === "spotify-this-song") {
    spotifySearch(name);
}
//  node liri.js movie-this '<movie name here>'
else if (action === "movie-this") {
    movieSearch(name);
}
//  node liri.js do-what-it-says
else if (action === "do-what-it-says") {
    textFileSearch();
}
else {
    console.log("Search Invalid. Change format?")
}

