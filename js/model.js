(function (window) {
    'use strict';
    
	function Model(storage) {
		this.storage = storage;
	}

	Model.prototype.create = function (newData, callback) {
		callback = callback || function () {};

		this.storage.save(newData, callback);
	};

	Model.prototype.read = function (query, callback) {
        var queryType = typeof query;
        
		callback = callback || function () {};

		if (queryType === 'function') {
			callback = query;
			return this.storage.findAll(callback);
		} else if (queryType === 'string' || queryType === 'number') {
			query = parseInt(query, 10);
			this.storage.find({ id: query }, callback);
		} else {
			this.storage.find(query, callback);
		}
	};

	Model.prototype.update = function (id, data, callback) {
		this.storage.save(data, callback, id);
	};

	Model.prototype.remove = function (id, callback) {
		this.storage.remove(id, callback);
	};

	Model.prototype.removeAll = function (callback) {
		this.storage.drop(callback);
	};

	// Export to window
	window.app = window.app || {};
	window.app.Model = Model;
})(window);