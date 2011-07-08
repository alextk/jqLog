module("LoggersManager: pretests");

test("Basic requirements", function() {
  ok($.jqLog.classes.LoggersManager, "$.jqLog.classes.LoggersManager must be present");
});

test("new instance", function() {
  var manager = new $.jqLog.classes.LoggersManager();
  ok(manager.rootLogger);
  equals(manager.rootLogger.name, '');
  equals(manager.rootLogger.level, $.jqLog.Level.DEBUG);
});

test("configure()", function() {
  var Level = $.jqLog.Level;

  var manager = new $.jqLog.classes.LoggersManager();
  equals(manager.rootLogger.level, Level.DEBUG);
  manager.configure({root: {level: Level.WARN}});
  equals(manager.rootLogger.level, Level.WARN);
});

module("LoggersManager", {
  setup: function() {
    this.manager = new $.jqLog.classes.LoggersManager();
  }
});

test("logger()", function() {
  var l1 = this.manager.logger('com.jqlog.Logger1');
  var l2 = this.manager.logger('com.jqlog.Logger2');
  equals(l1.name, 'com.jqlog.Logger1');
  equals(l1.level, undefined);
  equals(l2.name, 'com.jqlog.Logger2');
  equals(l2.level, undefined);
  equals(l1, this.manager.logger('com.jqlog.Logger1'));
});

test("configure()", function() {
  var Level = $.jqLog.Level;

  this.manager.configure({
    'com.jqlog.Logger1': {level: Level.WARN},
    'com.jqlog.Logger2': {level: Level.INFO}
  });
  var l1 = this.manager.logger('com.jqlog.Logger1');
  var l2 = this.manager.logger('com.jqlog.Logger2');
  equals(l1.name, 'com.jqlog.Logger1');
  equals(l1.level, Level.WARN);
  equals(l2.name, 'com.jqlog.Logger2');
  equals(l2.level, Level.INFO);
  equals(l1, this.manager.logger('com.jqlog.Logger1'));

  this.manager.configure({
    root: {level: Level.INFO},
    'com.jqlog': {level: Level.ERROR},
    'com.jqlog.Logger2': {level: Level.DEBUG}
  });

  equals(l1.level, Level.WARN);
  equals(l2.level, Level.DEBUG);
  equals(this.manager.rootLogger.level, Level.INFO);
});

test("isLevelEnabled()", function() {
  var Level = $.jqLog.Level;

  this.manager.configure({
    'com.jqlog.Logger1': {level: Level.WARN},
    'com.jqlog.Logger2': {level: Level.INFO}
  });

  var l1 = this.manager.logger('com.jqlog.Logger1');
  var l2 = this.manager.logger('com.jqlog.Logger2');
  equals(l1.level, Level.WARN);
  equals(l2.level, Level.INFO);

  equals(this.manager.isLevelEnabled(l1, Level.FATAL), true);
  equals(this.manager.isLevelEnabled(l1, Level.ERROR), true);
  equals(this.manager.isLevelEnabled(l1, Level.WARN), true);
  equals(this.manager.isLevelEnabled(l1, Level.INFO), false);
  equals(this.manager.isLevelEnabled(l1, Level.DEBUG), false);

  equals(this.manager.isLevelEnabled(l2, Level.FATAL), true);
  equals(this.manager.isLevelEnabled(l2, Level.ERROR), true);
  equals(this.manager.isLevelEnabled(l2, Level.WARN), true);
  equals(this.manager.isLevelEnabled(l2, Level.INFO), true);
  equals(this.manager.isLevelEnabled(l2, Level.DEBUG), false);
});

test('level inheritance: root', function(){
  var Level = $.jqLog.Level;

  this.manager.configure({
    root: {level: Level.WARN},
    'com.jqlog.Logger1': {level: Level.ERROR},
    'com.jqlog.Logger2': {level: Level.INFO}
  });

  var l1 = this.manager.logger('com.jqlog.Logger1');
  var l2 = this.manager.logger('com.jqlog.Logger2');
  var root = this.manager.rootLogger;
  equals(root.level, Level.WARN);
  equals(l1.level, Level.ERROR);
  equals(l2.level, Level.INFO);

  equals(this.manager.isLevelEnabled(l1, Level.FATAL), true);
  equals(this.manager.isLevelEnabled(l1, Level.ERROR), true);
  equals(this.manager.isLevelEnabled(l1, Level.WARN), false);
  equals(this.manager.isLevelEnabled(l1, Level.INFO), false);
  equals(this.manager.isLevelEnabled(l1, Level.DEBUG), false);

  equals(this.manager.isLevelEnabled(l2, Level.FATAL), true);
  equals(this.manager.isLevelEnabled(l2, Level.ERROR), true);
  equals(this.manager.isLevelEnabled(l2, Level.WARN), true);
  equals(this.manager.isLevelEnabled(l2, Level.INFO), false);
  equals(this.manager.isLevelEnabled(l2, Level.DEBUG), false);
});

test('level inheritance: parent', function(){
  var Level = $.jqLog.Level;

  this.manager.configure({
    root: {level: Level.DEBUG},
    'com.jqlog': {level: Level.WARN},
    'com.jqlog.Logger1': {level: Level.INFO},
    'com.jqlog.Logger2': {level: Level.ERROR}
  });

  var l1 = this.manager.logger('com.jqlog.Logger1');
  var l2 = this.manager.logger('com.jqlog.Logger2');
  var root = this.manager.rootLogger;
  equals(root.level, Level.DEBUG);
  equals(l1.level, Level.INFO);
  equals(l2.level, Level.ERROR);

  equals(this.manager.isLevelEnabled(l1, Level.FATAL), true);
  equals(this.manager.isLevelEnabled(l1, Level.ERROR), true);
  equals(this.manager.isLevelEnabled(l1, Level.WARN), true);
  equals(this.manager.isLevelEnabled(l1, Level.INFO), false);
  equals(this.manager.isLevelEnabled(l1, Level.DEBUG), false);

  equals(this.manager.isLevelEnabled(l2, Level.FATAL), true);
  equals(this.manager.isLevelEnabled(l2, Level.ERROR), true);
  equals(this.manager.isLevelEnabled(l2, Level.WARN), false);
  equals(this.manager.isLevelEnabled(l2, Level.INFO), false);
  equals(this.manager.isLevelEnabled(l2, Level.DEBUG), false);
});

test('level inheritance: parent', function(){
  var Level = $.jqLog.Level;

  this.manager.configure({
    root: {level: Level.ERROR},
    'com.jqlog': {level: Level.WARN},
    'com.jqlog.Logger1': {level: Level.DEBUG},
    'com.jqlog.Logger2': {level: Level.DEBUG}
  });

  var l1 = this.manager.logger('com.jqlog.Logger1');
  var l2 = this.manager.logger('com.jqlog.Logger2');
  var root = this.manager.rootLogger;
  equals(root.level, Level.ERROR);
  equals(l1.level, Level.DEBUG);
  equals(l2.level, Level.DEBUG);

  equals(this.manager.isLevelEnabled(l1, Level.FATAL), true);
  equals(this.manager.isLevelEnabled(l1, Level.ERROR), true);
  equals(this.manager.isLevelEnabled(l1, Level.WARN), false);
  equals(this.manager.isLevelEnabled(l1, Level.INFO), false);
  equals(this.manager.isLevelEnabled(l1, Level.DEBUG), false);

  equals(this.manager.isLevelEnabled(l2, Level.FATAL), true);
  equals(this.manager.isLevelEnabled(l2, Level.ERROR), true);
  equals(this.manager.isLevelEnabled(l2, Level.WARN), false);
  equals(this.manager.isLevelEnabled(l2, Level.INFO), false);
  equals(this.manager.isLevelEnabled(l2, Level.DEBUG), false);
});
