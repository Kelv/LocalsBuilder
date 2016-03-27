var models = {
	datastore: require('./model-datastore')
};

module.exports = function(config){
	return models[config.dataBackend](config);
};