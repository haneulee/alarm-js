(function (window) {
	'use strict';

	function View(template) {
        var i, opt;

        this.template = template;

		this.$curTimeEl = document.querySelector('.curTime');
		this.$listEl = document.querySelector('.list');
		this.$date = document.querySelector('.date');
        this.$dialog = document.querySelector('.dialog');
        
        this.$form = document.alarmForm;
        this.$setHour = document.alarmForm.sh;
        this.$alarmHour = document.alarmForm.h;

        this.$setMinute = document.alarmForm.sm;
        this.$alarmMinute = document.alarmForm.m;
        this.$setSecond = document.alarmForm.ss;

		$(this.$date).datepicker();
        $(this.$dialog).dialog({ autoOpen: false });

        for (i = 1; i < 13; i++) {
            opt = document.createElement('option');
            opt.value = (i < 10 ? "0" : "") + i;
            opt.innerHTML = i;
            this.$alarmHour.appendChild(opt.cloneNode(true));
            this.$setHour.appendChild(opt.cloneNode(true));
        }

        for (i = 0; i < 60; i++) {
            opt = document.createElement('option');
            opt.value = (i < 10 ? "0" : "") + i;
            opt.innerHTML = i;
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
    
	View.prototype.render = function (viewCmd, parameter) {
		var self = this;
		var viewCommands = {
			showEntries: function () {
				self.$todoList.innerHTML = self.template.show(parameter);
			},
			removeItem: function () {
				self._removeItem(parameter);
			},
			updateElementCount: function () {
				self.$todoItemCounter.innerHTML = self.template.itemCounter(parameter);
			},
			setFilter: function () {
				self._setFilter(parameter);
			},
			clearNewTodo: function () {
				self.$newTodo.value = '';
			},
			editItem: function () {
				self._editItem(parameter.id, parameter.title);
            }
		};

		viewCommands[viewCmd]();
	};

	View.prototype.bind = function (event, handler) {
		var self = this;
		if (event === 'newAlarm') {
            self.$form.add.addEventListener('click', function () {
				handler();
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
                handler(e.target.name);
            });
        }
	};

	// Export to window
	window.app = window.app || {};
	window.app.View = View;
}(window));