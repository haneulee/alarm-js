(function () {
	'use strict';

	/**
	 * Sets up a new alarm list.
	 *
	 * @param {string} name The name of your new alarm list.
	 */
	function Alarm(name) {
		this.storage = new app.Store(name);
		this.model = new app.Model(this.storage);
		this.template = new app.Template();
		this.view = new app.View(this.template);
		this.controller = new app.Controller(this.model, this.view);
	}

	var alarm = new Alarm('alarm-vanillajs');

	function setView() {
		alarm.controller.setView();
	}

	window.addEventListener('load', setView);
	window.addEventListener('hashchange', setView);
})();