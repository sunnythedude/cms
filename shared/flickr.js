var httpRequest = require('request');
var credentials = require('./credentials.js');
var flickr = {
	flickrSettings : {
		"url": "https://api.flickr.com/services/rest/",
			"method": "GET", // default;
			"qs": {
				
				"format": "json",
				"nojsoncallback": 1,
				"api_key": credentials.flickr.api_key
			},
			"json": true,
		}, 
		initSettings: function () {
			flickr.flickrSettings.qs = {
				"format": "json",
				"nojsoncallback": 1,
				"api_key": credentials.flickr.api_key
			}
		},
		createPhotoList: function (data) {
			var i,
			photos = data.photos.photo,
			href,
			photoUrl = [],
			len = photos.length;
			for (i = 0; i < len; i++) {
				photo = photos[i];
				url = "https://farm"+photo.farm+".staticflickr.com/"+photo.server+"/"+photo.id+"_"+photo.secret+".jpg";
				photoUrl.push(url);
			};
			return photoUrl;
		},
		generateImages: function (photoUrl) {
			return '<img src="' + photoUrl.join('"><img src="') + '">';
		}
		
	};
	if (typeof module !== "undefined") {
		module.exports = flickr;
	}