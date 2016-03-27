var gcloud = require('gcloud');

module.exports = function(config){
	var ds = gcloud.datastore.dataset(config.gcloud);
	var kind = 'Local';

	// Translates from datastore format to applications format
	function fromDatastore(obj){
		obj.data.id = obj.key.id;
		return obj.data;
	}

	// Translates from application format to datastores format
	function toDatastore(obj, nonIndexed) {
		nonIndexed = nonIndexed || [];
		var results = [];
		Object.keys(obj).forEach(function(k) {
		  if (obj[k] === undefined) { return; }
		  results.push({
		    name: k,
		    value: obj[k],
		    excludeFromIndexes: nonIndexed.indexOf(k) !== -1
		  });
		});
		return results;
	}

	// List a number of objects limited by 'limit' parameter
	function list(limit, token, cb){
		var q = ds.createQuery([kind])
	      .limit(limit)
	      .order('name')
	      .start(token);

	    ds.runQuery(q, function(err, entities, nextQuery) {
	      if (err) { return cb(err); }
	      var hasMore = entities.length === limit ? nextQuery.startVal : false;
	      cb(null, entities.map(fromDatastore), hasMore);
	    });
	}

	// Updates object with fiven id
	// If not id provided creates a new object
	function update(id, data, cb){
		var key;
	    if (id) {
	      key = ds.key([kind, parseInt(id, 10)]);
	    } else {
	      key = ds.key(kind);
	    }

	    var entity = {
	      key: key,
	      data: toDatastore(data, ['description', 'address', 'schedule','latitude', 'longitude', 'logo_url'])
	    };

	    ds.save(
	      entity,
	      function(err) {
	        data.id = entity.key.id;
	        cb(err, err ? null : data);
	      }
	    );
	}

	function read(id, cb) {
	    var key = ds.key([kind, parseInt(id, 10)]);
	    ds.get(key, function(err, entity) {
	      if (err) { return cb(err); }
	      if (!entity) {
	        return cb({
	          code: 404,
	          message: 'Not found'
	        });
	      }
	      cb(null, fromDatastore(entity));
	    });
	}

	function _delete(id, cb) {
	    var key = ds.key([kind, parseInt(id, 10)]);
	    ds.delete(key, cb);
	}

	return {
	    create: function(data, cb) {
	      update(null, data, cb);
	    },
	    read: read,
	    update: update,
	    delete: _delete,
	    list: list
	};
};