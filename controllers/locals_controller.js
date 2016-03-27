var config = require('../config')();
var model = require('../models/model')(config);

// Requests to 'locals'
exports.all = function(req,res,next){
    res.writeHead(200, {'Content-Type': 'text/html'});
    next();
};

exports.list = function(req,res,next){
	// Read up to 10 elements and show them
	model.list(10, req.query.pageToken, function(err, entities, cursor){
		if(err) {return next(err);}
		res.render('locals/list', {
			locals: entities,
			nextPageToken: cursor
		});
	});
};

// Requests to 'locals/add'
exports.getAdd = function(req,res,next){
	// res.end("Rendering adding form");
	res.render('locals/new', {local:{}});
};

exports.postAdd = function(req,res,next){
	// Get data from body
	var data = req.body.local;
	// Set logo url
	if(req.file && req.file.cloudStoragePublicUrl){
		data.logo_url = req.file.cloudStoragePublicUrl;
	}
	
	// Save data to database
	model.create(data, function(err, savedData){
		if(err) { return next(err);}
		res.redirect(req.baseUrl + '/' + savedData.id);
	});
};

// Requests to 'locals/:id'
exports.getById = function(req,res,next){
	res.end("Getting local " + req.params.localId + " information");
};

exports.deleteById = function(req,res,next){
	model.delete(req.params.localId, function(err){
		if(err){return next(err);}
		res.redirect(req.baseUrl);
	});
	// res.end("Deleting local: " + req.params.localId);
};

// Requests to 'locals/:id/edit'
exports.edit = function(req,res,next){
	model.read(req.params.localId, function(err, entity){
		if(err) {return next(err);}
		res.render('locals/edit', {
			local: entity
		});
	});
};

// Requests to 'locals/:id/edit'
exports.update = function(req,res,next){
	// Get data from body
	var data = req.body.local;
	// Set logo url
	if(req.file && req.file.cloudStoragePublicUrl){
		data.logo_url = req.file.cloudStoragePublicUrl;
	}

	// Save data to database
	model.update(req.params.localId, data, function(err, savedData){
		if(err) { return next(err);}
		res.redirect(req.baseUrl + '/' + savedData.id);
	});
};