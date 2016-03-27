var express = require('express');
var bodyParser = require('body-parser');
var localRouter = express.Router();
var localsController = require('../controllers/locals_controller');
var config = require('../config')();
var images = require('../lib/images')(config.gcloud, config.cloudStorageBucket);
localRouter.use(bodyParser.json());

/// Requests to 'locals/'
localRouter.route('/')
// .all(localsController.all)
.get(localsController.list);

/// Requests to url 'locals/add'
localRouter.route('/add')
// .all(localsController.all)
.get(localsController.getAdd)
.post(images.multer.single('logo'), images.sendToGCS,localsController.postAdd);

// Requests to /locals/:localId
localRouter.route('/:localId')
// .all(localsController.all)
.get(localsController.getById)
.delete(localsController.deleteById);

// Requests to '/locals/:localId/edit'
localRouter.route('/:localId/edit')
// .all(localsController.all)
.get(localsController.edit)
.post(images.multer.single('logo'), images.sendToGCS, localsController.update);

module.exports = localRouter;