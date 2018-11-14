(function (window) {
	'use strict';

	/**
	 * Takes a model and view and acts as the controller between them
	 *
	 * @constructor
	 * @param {object} model The model instance
	 * @param {object} view The view instance
	 */
	function Controller(model, view) {
		var self = this;
		self.model = model;
        self.view = view;
        self.currentTime = new Date();

		self.view.bind('newAlarm', function (title) {
			self.setAlarm(title);
        });
        
        self.view.bind('clearAlarm', function (title) {
			self.clearAlarm(title);
        });

        self.view.bind('setTime', function (title) {
			self.setTime(title);
        });

        self.view.bind('listItem', function (name) {
            self[name + "Alarm"](e.target);
        });
    }

    Controller.prototype.setTimer = function () {
        var self = this,
            alarmTimer;

        if (alarmTimer != null) clearInterval(alarmTimer);

        alarmTimer = setInterval(function() {
            var curTime = self.currentTime,
                s = curTime.getSeconds(),
                m = curTime.getMinutes(),
                h = curTime.getHours();

            s += 1;

            //분이 바뀔 때
            if (s == 60) {
                s = 0;
                m += 1;

                self.checkAlarm(h, m);
            }

            //시가 바뀔 때
            if (m == 60) {
                m = 0;
                h += 1;
            }

            if (curTime && !isNaN(h) && !isNaN(m) && !isNaN(s)) {
                curTime = new Date(
                    curTime.getFullYear(),
                    curTime.getMonth(),
                    curTime.getDate(),
                    h,
                    m,
                    s
                );
            } else {
                curTime = new Date();
            }

            self.currentTime = curTime;

            curTimeEl.innerHTML = curTime.toString();
            document.alarmForm.ch.value = curTime.getHours();
            document.alarmForm.cm.value = curTime.getMinutes();
            document.alarmForm.cs.value = curTime.getSeconds();
          }, 1000);
    };

    Controller.prototype.checkAlarm = function (h, m) {
        var self = this,
            i, time, ah, am;

        self.model.read(function (data) {
            for (i = 0; i < data.length; i++) {
                time = data[i].time;
                ah = Math.floor(time / 3600);
                am = Math.floor((time % 3600) / 60);

                if (m == am && h == ah) {
                    self.popupAlarm(data[i], ah, am);
                }
            }
		});
    };
    
    Controller.prototype.popupAlarm = function (data, h, m) {
        var alarmType = "",
            text;

        if (itemObj.snooze) {
            return;
        }

        if (itemObj.clockMode === "일반") {
            alarmType = "소리";
        } else if (itemObj.clockMode === "진동") {
            alarmType = "진동";
        } else {
            if (itemObj.alarmMode === "긴급") {
                alarmType = "소리";
            } else {
                return;
            }
        }

        text = h + " : " + m + "\n " + itemObj.msg + "\n " + alarmType + "입니다!!";

        $("#dialog").text(text);
        $("#dialog").dialog("open");

        // self.view.render('updateAlarm', data);

    };
    
    Controller.prototype.updateAlarm = function () {
		var self = this;
		self.model.getCount(function (alarms) {
			self.view.render('updateAlarm', alarms.active);
		});
	};

	Controller.prototype.setView = function (locationHash) {
		var route = locationHash.split('/')[1];
        var page = route || '';


        this.setTimer();

        this.updateAlarm();
	};

	// Export to window
	window.app = window.app || {};
	window.app.Controller = Controller;
})(window);