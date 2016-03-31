var path = require('path');
var gcloud = require('gcloud');

module.exports = function(gcloudConfig, cloudStorageBucket){
	var storage = gcloud.storage(gcloudConfig);
  	var bucket = storage.bucket(cloudStorageBucket);

	// Gets the image url in the cloud
	function getUrl(filename){
		return 'https://storage.googleapis.com/' +
	      cloudStorageBucket
	      '/' + filename;
	}

	// Handles uploads to Google Cloud
	function sendToGCS(req, res, next){
		if(!req.file) { return next(); }

		var gcsname = Date.now() + req.file.originalname;
	    var file = bucket.file(gcsname);
	    var stream = file.createWriteStream();

	    stream.on('error', function(err) {
	      req.file.cloudStorageError = err;
	      next(err);
	    });

	    stream.on('finish', function() {
	      req.file.cloudStorageObject = gcsname;
	      req.file.cloudStoragePublicUrl = getUrl(gcsname);
	      next();
	    });

	    stream.end(req.file.buffer); 
	}

	// Lets multer manage file requests
	var multer = require('multer')({
		inMemory: true,
		fileSize: 5 * 1024 * 1024,
		rename: function(fieldname,filename){
			return filename.replace(/\W+/g, '-').toLowerCase() + Date.now();
		}
	});

	return {
		getUrl: getUrl,
		sendToGCS: sendToGCS,
		multer: multer
	};
};