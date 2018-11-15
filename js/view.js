(function (window) {
	'use strict';

	function View(template) {
        var i, opt;

        this.template = template;

		this.$curTimeEl = document.querySelector('.curTime');
		this.$listEl = document.querySelector('.list');
		this.$date = $(document.querySelector('.date'));
        this.$dialog = $(document.querySelector('.dialog'));
        
		this.$form = document.alarmForm;
		
        this.$setHour = this.$form.sh;
        this.$setMinute = this.$form.sm;
		this.$setSecond = this.$form.ss;

		this.$curHour = this.$form.ch;
        this.$curMinute = this.$form.cm;
		this.$curSecond = this.$form.cs;

        this.$alarmHour = this.$form.h;
        this.$alarmMinute = this.$form.m;
		this.$ampm = this.$form.ampm;
		this.$content = this.$form.content;
		this.$alarmMode = this.$form.alarmMode;
		this.$clockMode = this.$form.clockMode;

		this.$date.datepicker();
		this.$dialog.dialog({ autoOpen: false });
		
		opt = document.createElement('option');

        for (i = 0; i < 60; i++) {
            opt.value = (i < 10 ? "0" : "") + i;
			opt.innerHTML = i;
			
			if (i > 0 && i < 13) {
				this.$alarmHour.appendChild(opt.cloneNode(true));
				this.$setHour.appendChild(opt.cloneNode(true));
			}

            this.$setMinute.appendChild(opt.cloneNode(true));
            this.$alarmMinute.appendChild(opt.cloneNode(true));
            this.$setSecond.appendChild(opt.cloneNode(true));
        }
	}

	View.prototype._removeItem = function (id) {
		var elem = qs('[data-id="' + id + '"]');

		if (elem) {
			this.$todoList.removeChild(elem);
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
    
	View.prototype.render = function (viewCmd, parameter) {
		var self = this;
		var viewCommands = {
			showEntries: function () {
				self.$listEl.innerHTML = self.template.show(parameter);
			},
			// removeItem: function () {
			// 	self._removeItem(parameter);
			// },
			// updateElementCount: function () {
			// 	self.$todoItemCounter.innerHTML = self.template.itemCounter(parameter);
			// },
			// setFilter: function () {
			// 	self._setFilter(parameter);
			// },
			// clearNewTodo: function () {
			// 	self.$newTodo.value = '';
			// },
			// editItem: function () {
			// 	self._editItem(parameter.id, parameter.title);
			// },
			countTime: function () {
				self.$curTimeEl.innerHTML = parameter.curTime;
				self.$curHour.value = parameter.curHour;
				self.$curMinute.value = parameter.curMinute;
				self.$curSecond.value = parameter.curSecond;
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
			self.$form.setTime.addEventListener('click', function () {
				handler();
            });
        } else if (event === 'listItem') {
            self.$listEl.addEventListener('click', function (e) {
                handler(e.target);
            });
        }
	};

	// Export to window
	window.app = window.app || {};
	window.app.View = View;
}(window));