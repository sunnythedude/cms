(function(){
	var Hapi = require('hapi');
	var httpRequest = require('request');

// Create a server with a host and port
var  server = new Hapi.Server();

server.connection({
	host: 'localhost',
	port: 8000,
});

// Routes
server.route({
	method: 'GET',
	path: '/',
	handler: function (request, reply) {
		reply("homepage");
	}
});

server.route({
	method: 'GET',
	path: '/myflickr',
	handler: function (request, reply) {
		var flickr = require('./share/flickr.js');
		var credentials = require('./share/credentials.js');
		flickr.initSettings();
		flickr.flickrSettings.qs.user_id = credentials.flickr.user_id;
		flickr.flickrSettings.qs.method = "flickr.people.getPhotos";

		httpRequest(flickr.flickrSettings, function (err, res, body) {
			if (!err && res.statusCode == 200) {
				reply(flickr.generateImages(flickr.createPhotoList(body)));	
			};
		});
	}
});

server.route({
	method: 'GET',
	path: '/{param*}',
	handler: {
		directory: {
			path: 'public',
			listing: true
		}
	}
});

//Start the server;
server.start();
console.log('server connected by port 8000');

})();