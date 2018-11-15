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

		self.view.bind('newAlarm', function (data) {
			self.addAlarm(data);
        });
        
        self.view.bind('clearAlarm', function () {
			self.clearAlarm();
        });

        self.view.bind('setTime', function () {
			self.setTime();
        });

        self.view.bind('listItem', function (name) {
            self[name + "Alarm"](e.target);
        });
    }

    Controller.prototype.clearAlarm = function () {
        self.model.removeAll(function () {
            self.view.render('removeAll');
		});
    };

    Controller.prototype.addAlarm = function (data) {
        var self = this,
            ah = data.hour,
            am = data.minute,
            ampm = data.ampm,
            newAlarm;

		if (isNaN(ah) || isNaN(am) || !data.msg) {
			window.alert("값을 입력해주세요!");
			return;
		}

		if (ampm == "PM" && ah < 12) ah = ah + 12;
        if (ampm == "AM" && ah == 12) ah = ah - 12;

        newAlarm = {
            msg: data.msg,
            time: ah * 3600 + am * 60,
            snooze: false,
            alarmMode: data.alarmMode,
            clockMode: data.clockMode
        };

        self.model.create(newAlarm, function () {
            self.showAlarms();
            self.view.render('clearMsg');
        });
    };

    Controller.prototype.setTimer = function () {
        var self = this,
            alarmTimer;

        if (alarmTimer != null) clearInterval(alarmTimer);

        alarmTimer = setInterval(self.countTime(), 1000);
    };

    Controller.prototype.countTime = function () {
        var self = this,
            curTime = self.currentTime || new Date(),
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
            self.currentTime = new Date(
                curTime.getFullYear(),
                curTime.getMonth(),
                curTime.getDate(),
                h,
                m,
                s
            );

            self.view.render('countTime', {
                curTime : curTime.toString(),
                curHour : curTime.getHours(),
                curMinute : curTime.getMinutes(),
                curSecond : curTime.getSeconds()
            });
        }
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
                    //popup없애고 바로 render로 
                }
            }
		});
    };
    
    Controller.prototype.popupAlarm = function (itemObj, h, m) {
        var alarmType = "";

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

        self.view.render('popupAlarm', h + " : " + m + "\n " + itemObj.msg + "\n " + alarmType + "입니다!!");
    };
    
    Controller.prototype.showAlarms = function () {
		var self = this;
		self.model.read(function (alarms) {
            alarms.sort((a, b) => a.time > b.time);
			self.view.render('showEntries', alarms);
		});
	};

	Controller.prototype.setView = function (locationHash) {
		// var route = locationHash.split('/')[1];
        // var page = route || '';

        this.setTimer();
        this.showAlarms();
	};

	// Export to window
	window.app = window.app || {};
	window.app.Controller = Controller;
})(window);