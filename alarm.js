var Alarm = (function() {
  var alarmTimer = null,
    curTimeEl = document.getElementById("curTime"),
    listEl = document.getElementById("list"),
    currentTime;

  function initAlarm() {
    var i;

    currentTime = currentTime || new Date();

    if (alarmTimer != null) clearInterval(alarmTimer);

    $("#date").datepicker();
    $("#dialog").dialog({ autoOpen: false });

    for (i = 1; i < 13; i++) {
      document.alarmForm.sh.options.add(new Option((i < 10 ? "0" : "") + i, i));
      document.alarmForm.h.options.add(new Option((i < 10 ? "0" : "") + i, i));
    }

    for (i = 0; i < 60; i++) {
      document.alarmForm.sm.options.add(new Option((i < 10 ? "0" : "") + i, i));
      document.alarmForm.m.options.add(new Option((i < 10 ? "0" : "") + i, i));
      document.alarmForm.ss.options.add(new Option((i < 10 ? "0" : "") + i, i));
    }

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
    var ah = parseInt(document.alarmForm.h.value, 10),
      am = parseInt(document.alarmForm.m.value, 10),
      ampm = document.alarmForm.ampm.value;

    if (isNaN(ah) || isNaN(am) || !document.alarmForm.content.value) {
      window.alert("값을 입력해주세요!");
      return;
    }

    if (ampm == "PM" && ah < 12) ah = ah + 12;
    if (ampm == "AM" && ah == 12) ah = ah - 12;

    var alarmStorage = localStorage.getItem("alarm"),
      newAlarm = {
        id:
          "_" +
          Math.random()
            .toString(36)
            .substr(2, 9),
        msg: document.alarmForm.content.value,
        time: ah * 3600 + am * 60,
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

    document.alarmForm.content.value = "";
  }

  function updateAlarm() {
    var alarmList = localStorage.getItem("alarm"),
      i,
      time,
      h,
      m,
      color;

    if (!alarmList) {
      return;
    }

    listEl.innerHTML = "";
    alarmList = JSON.parse(alarmList);

    alarmList.sort((a, b) => a.time > b.time);

    for (i = 0; i < alarmList.length; i++) {
      time = alarmList[i].time;
      h = Math.floor(time / 3600);
      m = Math.floor((time % 3600) / 60);
      color = alarmList[i].snooze ? 'style="color:green;"' : "";

      listEl.innerHTML +=
        '<li id="' +
        alarmList[i].id +
        '"><span>' +
        (h < 10 ? "0" : "") +
        h +
        ":" +
        (m < 10 ? "0" : "") +
        m +
        " </span><span>" +
        alarmList[i].msg +
        "</span><input type=button name=snooze " +
        color +
        ' value="끄기"><input type=button name=delete value="삭제"></li>';
    }
  }

  function deleteAlarm(target) {
    var targetId = target.parentNode.id,
      alarmList = JSON.parse(localStorage.getItem("alarm"));

    alarmList = alarmList.filter(function(item) {
      return item.id !== targetId;
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
        alarmList[i].snooze = !alarmList[i].snooze;
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
    var date = document.alarmForm.date.value.split("/"),
      year = parseInt(date[2], 10),
      month = parseInt(date[0], 10) - 1,
      day = parseInt(date[1], 10),
      sh = parseInt(document.alarmForm.sh.value, 10),
      sm = parseInt(document.alarmForm.sm.value, 10),
      ss = parseInt(document.alarmForm.ss.value, 10),
      sampm = document.alarmForm.sampm.value;

    if (
      isNaN(sh) ||
      isNaN(sm) ||
      isNaN(ss) ||
      isNaN(year) ||
      isNaN(month) ||
      isNaN(day)
    ) {
      window.alert("시간 설정 값을 입력해주세요!");
      return;
    }

    if (sampm == "PM" && sh < 12) sh = sh + 12;
    if (sampm == "AM" && sh == 12) sh = sh - 12;

    currentTime = new Date(year, month, day, sh, sm, ss);

    document.alarmForm.sh.value = "";
    document.alarmForm.sm.value = "";
    document.alarmForm.ss.value = "";
  }

  function countTime() {
    var s = currentTime.getSeconds(),
      m = currentTime.getMinutes(),
      h = currentTime.getHours(),
      alarmList,
      i,
      time,
      ah,
      am;

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
          am = Math.floor((time % 3600) / 60);

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

    text = h + " : " + m + "\n " + itemObj.msg + "\n " + alarmType + "입니다!!";

    $("#dialog").text(text);
    $("#dialog").dialog("open");
  }

  return {
    initAlarm,
    setAlarm,
    updateAlarm,
    deleteAlarm,
    snoozeAlarm,
    clearAlarm,
    setTime,
    countTime,
    popupAlarm
  };
})();
