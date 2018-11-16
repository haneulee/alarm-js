(function (window) {
	'use strict';

	function View(template) {
		var self = this,
			i, opt;

		self.template = template;

		self.$curTimeEl = document.querySelector('.curTime');
		self.$listEl = document.querySelector('.list');
        self.$dialog = $(document.querySelector('.dialog'));
        
		self.$form = document.alarmForm;
		
        self.$setHour = self.$form.sh;
        self.$setMinute = self.$form.sm;
		self.$setSecond = self.$form.ss;
		self.$setDate = self.$form.date;
		self.$setAmpm = self.$form.sampm;

        self.$alarmHour = self.$form.h;
        self.$alarmMinute = self.$form.m;
		self.$ampm = self.$form.ampm;
		self.$content = self.$form.content;
		self.$alarmMode = self.$form.alarmMode;
		self.$clockMode = self.$form.clockMode;

		$(self.$setDate).datepicker();
		self.$dialog.dialog({ autoOpen: false });
		
		opt = document.createElement('option');

        for (i = 0; i < 60; i++) {
            opt.value = (i < 10 ? "0" : "") + i;
			opt.innerHTML = i;
			
			if (i > 0 && i < 13) {
				self.$alarmHour.appendChild(opt.cloneNode(true));
				self.$setHour.appendChild(opt.cloneNode(true));
			}

            self.$setMinute.appendChild(opt.cloneNode(true));
            self.$alarmMinute.appendChild(opt.cloneNode(true));
            self.$setSecond.appendChild(opt.cloneNode(true));
        }
	}

	View.prototype._removeItem = function (id) {
		var self = this,
			elem = document.querySelector('[id="' + id + '"]');

		if (elem) {
			self.$listEl.removeChild(elem);
		}
	};

	View.prototype._editItem = function (id, snooze) {
		var self = this,
			elem = self.$listEl.querySelector('[id="' + id + '"]'),
			snoozeButton = elem ? elem.querySelector('[name="snooze"]') : null;

		if (snoozeButton) {
			snoozeButton.style.color = snooze;
		}
	};

	View.prototype._getAlarmVals = function () {
		var self = this;
		return {
			hour: parseInt(self.$alarmHour.value, 10),
			minute: parseInt(self.$alarmMinute.value, 10),
			ampm: self.$ampm.value,
			msg: self.$content.value,
			alarmMode: self.$alarmMode.value,
			clockMode: self.$clockMode.value
		}
	};

	View.prototype._getTimeVals = function () {
		var self = this,
			date = self.$setDate.value.split("/");
		return {
			year: parseInt(date[2], 10),
			month: parseInt(date[0], 10) - 1,
			day: parseInt(date[1], 10),
			hour: parseInt(self.$setHour.value, 10),
			minute: parseInt(self.$setMinute.value, 10),
			second: parseInt(self.$setSecond.value, 10),
			ampm: self.$setAmpm.value
		}
	};

	View.prototype._itemId = function (element) {
		var li = element.parentNode;
		return parseInt(li.id, 10);
	};
    
	View.prototype.render = function (viewCmd, parameter) {
		var self = this;
		var viewCommands = {
			showEntries: function () {
				self.$listEl.innerHTML = self.template.show(parameter);
			},
			removeItem: function () {
				self._removeItem(parameter);
			},
			editItem: function () {
				self._editItem(parameter.id, parameter.snooze);
			},
			countTime: function () {
				self.$curTimeEl.innerHTML = parameter.curTime;
			},
			popupAlarm: function () {
        		self.$dialog.text(parameter);
				self.$dialog.dialog("open");
			},
			clearMsg: function () {
				self.$content.innerHTML = "";
			},
			removeAll: function () {
				self.$listEl.innerHTML = "";
			},
			clearTimeSetting: function () {
				self.$setHour.value = "";
				self.$setMinute.value = "";
				self.$setSecond.value = "";
			}
		};

		viewCommands[viewCmd]();
	};

	View.prototype.bind = function (event, handler) {
		var self = this;
		if (event === 'newAlarm') {
            self.$form.add.addEventListener('click', function () {
				handler(self._getAlarmVals());
            });
		} else if (event === 'clearAlarm') {
			self.$form.clear.addEventListener('click', function () {
				handler();
            });
		} else if (event === 'setTime') {
			self.$form.timeSetting.addEventListener('click', function () {
				handler(self._getTimeVals());
            });
        } else if (event === 'listItem') {
            self.$listEl.addEventListener('click', function (e) {
				var target = e.target;
                handler({id: self._itemId(target), snooze: target.style.color, name: target.name});
            });
        }
	};

	// Export to window
	window.app = window.app || {};
	window.app.View = View;
}(window));