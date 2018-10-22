QUnit.module("KAKAO ALARM");

Alarm.initAlarm();

QUnit.test("initAlarm", function(assert) {
  assert.equal(
    12,
    document.alarmForm.sh.options.length,
    "시간 옵션 갯수 : " + document.alarmForm.sh.options.length
  );

  assert.equal(
    60,
    document.alarmForm.sm.options.length,
    "분 옵션 갯수 : " + document.alarmForm.sm.options.length
  );

  assert.equal(
    60,
    document.alarmForm.ss.options.length,
    "초 옵션 갯수 : " + document.alarmForm.ss.options.length
  );
});

QUnit.test("set, count Time", function(assert) {
  document.alarmForm.date.value = "10/10/2017";
  document.alarmForm.sampm.value = "PM";
  document.alarmForm.sh.value = "01";
  document.alarmForm.sm.value = "30";
  document.alarmForm.ss.value = "30";

  Alarm.setTime();
  Alarm.countTime();

  assert.ok(
    document.alarmForm.ch.value,
    "현재 시 : " + document.alarmForm.ch.value
  );

  assert.ok(
    document.alarmForm.cm.value,
    "현재 분 : " + document.alarmForm.cm.value
  );

  assert.ok(
    document.alarmForm.ampm.value,
    "현재 am/pm : " + document.alarmForm.ampm.value
  );

  assert.ok(
    document.alarmForm.cs.value,
    "현재 초 : " + document.alarmForm.cs.value
  );
});

QUnit.test("setAlarm", function(assert) {
  document.alarmForm.ampm.value = "PM";
  document.alarmForm.h.value = "03";
  document.alarmForm.m.value = "30";
  document.alarmForm.content.value = "새로운 프로젝트 회의";
  document.alarmForm.alarmMode.value = "일반";
  document.alarmForm.clockMode.value = "일반";

  Alarm.setAlarm();

  var alarmList = JSON.parse(localStorage.getItem("alarm")),
    h, m, ampm;

  alarmList = alarmList.filter(function(item) {
    return item.msg === "새로운 프로젝트 회의";
  });

  assert.equal(
    "새로운 프로젝트 회의",
    alarmList[0].msg,
    "알람 메세지 : " + alarmList[0].msg
  );

  assert.equal(
    "일반",
    alarmList[0].alarmMode,
    "알람 모드 : " + alarmList[0].alarmMode
  );

  h = Math.floor(alarmList[0].time / 3600);
  m = Math.floor((alarmList[0].time % 3600) / 60);

  ampm = h >= 12 ? "PM": "AM";
  h = h % 12;
  h = h ? h : 12;

  assert.equal(
    "03",
    h,
    "알람 시 : " + h
  );

  assert.equal(
    "30",
    m,
    "알람 분 : " + m
  );

  assert.equal(
    "PM",
    ampm,
    ampm
  );
});

QUnit.test("clear, snooze, popup, delete Alarm", function(assert) {
  Alarm.clearAlarm();

  assert.notOk(
    localStorage.getItem("alarm"),
    "알람 클리어 : " + localStorage.getItem("alarm")
  );

  document.alarmForm.ampm.value = "PM";
  document.alarmForm.h.value = "12";
  document.alarmForm.m.value = "44";
  document.alarmForm.content.value = "새로운 프로젝트 회의";
  document.alarmForm.alarmMode.value = "일반";
  document.alarmForm.clockMode.value = "일반";

  Alarm.setAlarm();

  var listEl = document.getElementById("list"),
    target = listEl.firstChild,
    id = target.getAttribute("id"),
    color, alarmList, msg;

  Alarm.snoozeAlarm(target.querySelector("[name=snooze]"));

  alarmList = JSON.parse(localStorage.getItem("alarm"));
  alarmList = alarmList.filter(function(item) {
    return item.id === id;
  });

  assert.equal(
    true,
    alarmList[0].snooze,
    "끄기 상태 : " + alarmList[0].snooze
  );

  color = target.querySelector("[name=snooze]").style.color;
  assert.equal(
    "green",
    color,
    "끄기 color : " + color
  );

  Alarm.snoozeAlarm(target.querySelector("[name=snooze]"));

  Alarm.popupAlarm(alarmList[0], Math.floor( alarmList[0].time / 3600), 
                    Math.floor(( alarmList[0].time % 3600) / 60));

  msg = $("#dialog").text();

  assert.ok(
    msg,
    "알람 다이얼로그 메세지 : " + msg
  );
  
  Alarm.deleteAlarm(target.querySelector("[name=delete]"));

  assert.notOk(
    document.querySelector('[id='+ id + ']'),
    "제거 완료 : " + JSON.stringify(target)
  );
});


