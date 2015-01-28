var Hapi = require('hapi');

// Create a server with a host and port
var server = new Hapi.Server();
server.connection({ 
    host: 'localhost', 
    port: 8000 
});

server.route({
	method: 'GET',
	path:'/{param*}',
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
	path:'/shared/{param*}',
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
    path:'/flickr', 
    handler: function (request, reply) {
		var credentials = require('./shared/credentials.js'),
			flickrLib = require('./shared/flickr.js'),
			httpRequest = require('request'),
			flickr = {
				"url": 'https://api.flickr.com/services/rest/',
				"qs": {
					"method": 'flickr.photos.search',
					"api_key": credentials.flickr.api_key,
					"tags": 'seabus',
					"format": 'json',
					"nojsoncallback": 1
				},
				"json": true
			};
		httpRequest(flickr, function (error, incomingMessage, response) {
			if (!error && incomingMessage.statusCode === 200) {
				var photoSrc = flickrLib.createJpgPath(response.photos.photo);
				// todo inclass: output HTML images
				reply("<img src='hello.png'>"); // Complete browser output
			}
		});
    }
});

server.route({
    method: 'GET',
    path:'/myflickr', 
    handler: function (request, reply) {
		var credentials = require('./shared/credentials.js'),
			flickr = require('./shared/flickr.js'),
			httpRequest = require('request');
		flickr.options.qs = flickr.options.data;
		flickr.options.qs.api_key = credentials.flickr.api_key;
		flickr.options.qs.user_id = credentials.flickr.user_id;
		
		httpRequest(flickr.options, function (error, incomingMessage, response) {
			if (!error && incomingMessage.statusCode === 200) {
				var html = '';
					photoSrc = flickr.createJpgPath(response.photos.photo);
				for (var i = 0, len = photoSrc.length; i < len; i++) {
					html += "<img src='" + photoSrc[i] + "'>";
				}
				reply(html); // Complete browser output
			}
		});
    }
});

// Start the server
server.start(function () {
	console.log('Server running at ' + server.info.uri);
});