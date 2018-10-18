var Alarm = (function() {
  var alarmTimer = null,
    curTimeEl = document.getElementById("curTime"),
    setTimeEl,
    currentTime,
    alarmSet;

  function initAlarm(e) {
    currentTime = currentTime || new Date();

    if (alarmTimer != null) clearInterval(alarmTimer);

    clearAlarm();

    document.alarmForm.h.value = currentTime.getHours();
    document.alarmForm.m.value = currentTime.getMinutes();
    // document.alarmForm.s.value = currentTime.getSeconds();
    document.alarmForm.add.addEventListener("click", function() {
      setAlarm();
    });
    document.alarmForm.setTime.addEventListener("click", function() {
      setTime();
    });

    alarmTimer = setInterval(function() {
      countTime();
    }, 1000);
  }

  function setAlarm() {
    alarmSet = true;
  }

  function clearAlarm() {
    alarmSet = false;
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
  }

  function matchH() {
    return document.alarmForm.ch.value == document.alarmForm.h.value;
  }

  function matchM() {
    return document.alarmForm.cm.value == document.alarmForm.m.value;
  }

  function matchS() {
    // return document.alarmForm.cs.value == document.alarmForm.s.value;
  }

  function countTime() {
    var s = currentTime.getSeconds(),
      m = currentTime.getMinutes(),
      h = currentTime.getHours(),
      time;

    s += 1;

    if (s == 60) {
      s = 0;
      m += 1;
    }

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

    if (matchH() && matchM() && matchS()) {
      alert("뚜뚜뚜뚜...일어나세요... ");
    }
  }

  return {
    initAlarm: initAlarm
  };
})();
