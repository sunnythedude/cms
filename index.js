var Hapi = require('hapi');

// Create a server with a host and port
var server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 8000
});

server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: "public",
            listing: true,
            index: false
        }
    }
});
server.route({
    method: 'GET',
    path: '/shared/{param*}',
    handler: {
        directory: {
            path: "shared",
            listing: true,
            index: false
        }
    }
});

// Add the route
server.route({
    method: 'GET',
    path: '/flickr',
    handler: function (request, reply) {
        var credentials = require('./shared/credentials.js'),
                flickrLib = require('./shared/flickr.js'),
                httpRequest = require('request'),
                flickr = {
                    "url": 'https://api.flickr.com/services/rest/',
                    "qs": {
                        "method": 'flickr.photos.search',
                        "api_key": credentials.flickr.api_key,
                        "user_id": 'credentials.flickr.user_id',
                        "format": 'json',
                        "nojsoncallback": 1
                    },
                    "json": true
                };
        httpRequest(flickr, function (error, incomingMessage, response) {
            if (!error && incomingMessage.statusCode === 200) {
                var photoSrc = flickrLib.createJpgPath(response.photos.photo);
                for (var i = 0, len = photoSrc.length; i < len; i++) {
                    html += "img src='" + photoSrc[i] + "'>";
                }
                ;

                // todo inclass: output HTML images
                reply(html); // Complete browser output
            }
        });
    }
});

server.route({
    method: 'GET',
    path: '/twitter',
    handler: function (request, reply) {
        var credentials = require("./shared/credentials.js"),
                Twit = require('twit'),
                twitterClient = new Twit(credentials.twitter);
        var twitterArray = [], tweetTxt;
        twitterClient.get('statuses/user_timeline', {
            screen_name: 'vanarts',
            count: 4
        },
        function (err, data, response) {
            data.forEach(function (record, idx) {
                tweetTxt = record.text;
                twitterArray.push({
                    "tweet": tweetTxt,
                    "tweetDate": record.created_at,
                    "index": idx
                });
            });
            reply(twitterArray);
        });
    }
});

// Start the server
server.start(function () {
    console.log('Server running at ' + server.info.uri);
});