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

  assert.ok(
    document.alarmForm.h.value,
    "현재 시 : " + document.alarmForm.h.value
  );

  assert.ok(
    document.alarmForm.m.value,
    "현재 분 : " + document.alarmForm.m.value
  );
});
