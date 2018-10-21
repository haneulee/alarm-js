QUnit.module("KAKAO ALARM");

/**
 * initAlarm
 * setAlarm
 * updateAlarm
 * deleteAlarm
 * snoozeAlarm
 * clearAlarm
 * setTime
 * countTime
 * popupAlarm
 */

QUnit.test("initAlarm", function(assert) {
  Alarm.initAlarm();

  assert.equal(
    12,
    document.alarmForm.sh.options.length,
    "시간 갯수 : " + document.alarmForm.sh.options.length
  );

  assert.equal(
    60,
    document.alarmForm.sm.options.length,
    "분 갯수 : " + document.alarmForm.sm.options.length
  );
});

QUnit.test("countTime", function(assert) {
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
    document.alarmForm.cs.value,
    "현재 초 : " + document.alarmForm.cs.value
  );
});
