var Alarm = (function() {
  var alarmTimer = null,
    curTimeEl = document.getElementById("curTime"),
    listEl = document.getElementById("list"),
    currentTime;

  function initAlarm(e) {
    currentTime = currentTime || new Date();

    if (alarmTimer != null) clearInterval(alarmTimer);
    
    document.alarmForm.h.value = currentTime.getHours();
    document.alarmForm.m.value = currentTime.getMinutes();
    document.alarmForm.add.addEventListener("click", function() {
      setAlarm();
    });
    document.alarmForm.clear.addEventListener("click", function() {
      clearAlarm();
    });
    document.alarmForm.setTime.addEventListener("click", function() {
      setTime();
    });
    listEl.addEventListener("click", function(e) {
      if (e.target.name === "snooze") {
        snoozeAlarm(e.target);
      } else if (e.target.name === "delete") {
        deleteAlarm(e.target);
      }
    });

    alarmTimer = setInterval(function() {
      countTime();
    }, 1000);

    updateAlarm();
  }

  function setAlarm() {
    alarmSet = true;

    if (isNaN(document.alarmForm.h.value) 
        || isNaN(document.alarmForm.m.value) 
        || !document.alarmForm.content.value) {
        window.alert("값을 입력해주세요!");
        return;
    }

    var alarmStorage = localStorage.getItem("alarm"),
      newAlarm = {
        id: '_' + Math.random().toString(36).substr(2, 9),
        msg: document.alarmForm.content.value,
        time: document.alarmForm.h.value * 3600 + document.alarmForm.m.value * 60, //currentTime || new Date(),
        snooze: false,
        alarmMode: document.alarmForm.alarmMode.value,
        clockMode: document.alarmForm.clockMode.value
      };

    if (!alarmStorage) {
      localStorage.setItem("alarm", JSON.stringify([newAlarm]));
    } else {
      var curList = JSON.parse(alarmStorage);
      localStorage.setItem("alarm", JSON.stringify(curList.concat([newAlarm])));
    }

    updateAlarm();

    document.alarmForm.h.value = "";
    document.alarmForm.m.value = "";
    document.alarmForm.content.value = "";
  }

  function updateAlarm() {
    var alarmList = localStorage.getItem("alarm"),
      i, time, h, m, color;

    if (!alarmList) {
      return;
    }

    listEl.innerHTML = "";
    alarmList = JSON.parse(alarmList);

    alarmList.sort((a, b) => a.time > b.time);

    for (i = 0; i < alarmList.length; i++) {
      time = alarmList[i].time;
      h = Math.floor(time / 3600);
      m = Math.floor(time % 3600 / 60);
      color = alarmList[i].snooze ? 'style="color:green;"' : "";
      
      listEl.innerHTML += '<li id="' + alarmList[i].id + '"><span>' + (h < 10 ? "0" : "") + h + ':' + (m < 10 ? "0" : "") +  m + ' </span><span>' + alarmList[i].msg 
      + '</span><input type=button name=snooze ' + color + ' value="끄기"><input type=button name=delete value="삭제"></li>';
    }

  }

  function deleteAlarm(target) {
    var targetId = target.parentNode.id,
      alarmList = JSON.parse(localStorage.getItem("alarm"));

    alarmList = alarmList.filter(function(item) {
      return item.id !== targetId
    });

    localStorage.setItem("alarm", JSON.stringify(alarmList));
    updateAlarm();
  }

  function snoozeAlarm(target) {
    var targetId = target.parentNode.id,
      alarmList = JSON.parse(localStorage.getItem("alarm")),
      i;

    for (i = 0; i < alarmList.length; i++) {
      if (alarmList[i].id == targetId) {
        alarmList[i].snooze = !(alarmList[i].snooze);
        target.style.color = alarmList[i].snooze === true ? "green" : "black";
         break;
      }
    }

    localStorage.setItem("alarm", JSON.stringify(alarmList));
  }

  function clearAlarm() {
    localStorage.removeItem("alarm");
    listEl.innerHTML = "";
  }

  function setTime() {
    currentTime = new Date(
      currentTime.getFullYear(),
      currentTime.getMonth(),
      currentTime.getDate(),
      document.alarmForm.sh.value,
      document.alarmForm.sm.value,
      document.alarmForm.ss.value
    );

    document.alarmForm.sh.value = "";
    document.alarmForm.sm.value = "";
    document.alarmForm.ss.value = "";
  }

  function countTime() {
    var s = currentTime.getSeconds(),
      m = currentTime.getMinutes(),
      h = currentTime.getHours(),
      alarmList, i, time, ah, am;

    s += 1;

    //분이 바뀔 때
    if (s == 60) {
      s = 0;
      m += 1;

      //알람 검사
      if (localStorage.getItem("alarm")) {
        alarmList = JSON.parse(localStorage.getItem("alarm"));

        for (i = 0; i < alarmList.length; i++) {
          time = alarmList[i].time;
          ah = Math.floor(time / 3600);
          am = Math.floor(time % 3600 / 60);

          if (m == am && h == ah) {
            popupAlarm(alarmList[i], ah, am);
          }
        }
      }
    }

    //시가 바뀔 때
    if (m == 60) {
      m = 0;
      h += 1;
    }

    if (currentTime && !isNaN(h) && !isNaN(m) && !isNaN(s)) {
      currentTime = new Date(
        currentTime.getFullYear(),
        currentTime.getMonth(),
        currentTime.getDate(),
        h,
        m,
        s
      );
    } else {
      currentTime = new Date();
    }

    curTimeEl.innerHTML = currentTime.toString();
    document.alarmForm.ch.value = currentTime.getHours();
    document.alarmForm.cm.value = currentTime.getMinutes();
    document.alarmForm.cs.value = currentTime.getSeconds();
  }

  function popupAlarm(itemObj, h, m) {
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

    text = h + ' : ' + m + '\n ' + itemObj.msg + '\n ' + alarmType + '입니다!!';

    window.alert(text);
  }

  return {
    initAlarm: initAlarm
  };
})();
