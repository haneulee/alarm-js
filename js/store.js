(function (window) {
	'use strict';

	function Store(name, callback) {
		callback = callback || function () {};

		this._dbName = name;

		if (!localStorage.getItem(name)) {
			var alarms = [];

            localStorage.setItem(name, JSON.stringify(alarms));
		}

		callback.call(this, JSON.parse(localStorage.getItem(name)));
	}

	Store.prototype.find = function (query, callback) {
		if (!callback) {
			return;
		}

		var alarms = JSON.parse(localStorage.getItem(this._dbName));

		callback.call(this, alarms.filter(function (alarm) {
			for (var q in query) {
				if (query[q] !== alarm[q]) {
					return false;
				}
			}
			return true;
		}));
	};

	Store.prototype.findAll = function (callback) {
		callback = callback || function () {};
		callback.call(this, JSON.parse(localStorage.getItem(this._dbName)));
	};

	Store.prototype.save = function (updateData, callback, id) {
		var alarms = JSON.parse(localStorage.getItem(this._dbName));

		callback = callback || function() {};
		if (id) {
			for (var i = 0; i < alarms.length; i++) {
				if (alarms[i].id === id) {
					for (var key in updateData) {
						alarms[i][key] = updateData[key];
					}
					break;
				}
			}

			localStorage.setItem(this._dbName, JSON.stringify(alarms));
			callback.call(this, alarms);
		} else {
			updateData.id = new Date().getTime();

			alarms.push(updateData);
			localStorage.setItem(this._dbName, JSON.stringify(alarms));
			callback.call(this, [updateData]);
		}
	};

	Store.prototype.remove = function (id, callback) {
		var alarms = JSON.parse(localStorage.getItem(this._dbName));

		for (var i = 0; i < alarms.length; i++) {
			if (alarms[i].id == id) {
				alarms.splice(i, 1);
				break;
			}
		}

		localStorage.setItem(this._dbName, JSON.stringify(alarms));
		callback.call(this, alarms);
	};

	Store.prototype.drop = function (callback) {
		var alarms = [];
		localStorage.setItem(this._dbName, JSON.stringify(alarms));
		callback.call(this, alarms);
	};

	// Export to window
	window.app = window.app || {};
	window.app.Store = Store;
})(window);