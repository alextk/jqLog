module("jqlog");

test("Basic requirements", function() {
  ok($.jqLog, "$.jqLog not present");
  ok($.jqLog.logger, "$.jqLog.logger not present");
  ok($.jqLog.configure, "$.jqLog.configure not present");
});

test("rootLogger()", function() {
  var rootLogger = $.jqLog.logger();
  equal(rootLogger.nameArr.length, 0);
  ok(rootLogger == $.jqLog.rootLogger());
  equal(rootLogger.level, $.jqLog.defaults.loggers.root.level);
});

module("jqlog", {
  setup: function() {
    $.jqLog._instance.reset();
  }
});

test("logger()", function() {
  var l1 = $.jqLog.logger('com.jqlog.Logger1');
  var l2 = $.jqLog.logger('com.jqlog.Logger2');
  equal(l1.name, 'com.jqlog.Logger1');
  equal(l1.level, undefined);
  equal(l2.name, 'com.jqlog.Logger2');
  equal(l2.level, undefined);
  ok(l1 == $.jqLog.logger('com.jqlog.Logger1'));
});

test("configure() - loggers", function() {
  var Level = $.jqLog.Level;

  $.jqLog.configure({
    loggers: {
      'com.jqlog.Logger1': {level: Level.WARN},
      'com.jqlog.Logger2': {level: Level.INFO}
    }
  });
  var l1 = $.jqLog.logger('com.jqlog.Logger1');
  var l2 = $.jqLog.logger('com.jqlog.Logger2');
  equal(l1.name, 'com.jqlog.Logger1');
  equal(l1.level, Level.WARN);
  equal(l2.name, 'com.jqlog.Logger2');
  equal(l2.level, Level.INFO);
  ok(l1 == $.jqLog.logger('com.jqlog.Logger1'));

  $.jqLog.configure({
    loggers: {
      root: {level: Level.INFO},
      'com.jqlog': {level: Level.ERROR},
      'com.jqlog.Logger2': {level: Level.DEBUG}
    }
  });

  equal(l1.level, Level.WARN);
  equal(l2.level, Level.DEBUG);
  equal($.jqLog.logger().level, Level.INFO);
});

test("configure() - appenders", function() {
  var Level = $.jqLog.Level;
  var console = new $.jqLog.classes.ArrayConsole();
  var appender = new $.jqLog.classes.ConsoleAppender({console: console});

  $.jqLog.configure({
    appenders: [appender, new $.jqLog.classes.ConsoleAppender()]
  });

  equal($.jqLog._instance.appenders.length, 2);
  equal($.jqLog._instance.appenders[0], appender);
});

test("log", function() {
  var Level = $.jqLog.Level;

  var console = new $.jqLog.classes.ArrayConsole();
  var appender = new $.jqLog.classes.ConsoleAppender({console: console});

  $.jqLog.configure({
    appenders: [appender],
    loggers: {
      root: {level: Level.INFO},
      'com.jqlog': {level: Level.WARN},
      'com.jqlog.Logger1': {level: Level.INFO},
      'com.yoyo.Logger2': {level: Level.DEBUG}
    }
  });

  var root = $.jqLog.logger();
  var l1 = $.jqLog.logger('com.jqlog.Logger1');
  var l2 = $.jqLog.logger('com.yoyo.Logger2');

  root.debug('poki mon');
  root.info('puki mon');
  equals(console.buffer.length, 1);
  equals(console.buffer.last().method, 'info');
  equals(console.buffer.last().message, 'INFO puki mon');

  l1.debug('l1 debug message');
  l1.info('l1 info message');
  equals(console.buffer.length, 1);
  equals(console.buffer.last().method, 'info');
  equals(console.buffer.last().message, 'INFO puki mon');

  l1.warn('l1 warn message');
  equals(console.buffer.length, 2);
  equals(console.buffer.last().method, 'warn');
  equals(console.buffer.last().message, 'WARN l1 warn message');

  l1.error('l1 error message');
  equals(console.buffer.length, 3);
  equals(console.buffer.last().method, 'error');
  equals(console.buffer.last().message, 'ERROR l1 error message');

  l2.debug('l2 debug message');
  equals(console.buffer.length, 3);
  equals(console.buffer.last().method, 'error');
  equals(console.buffer.last().message, 'ERROR l1 error message');
  
  l2.info('l2 info message');
  equals(console.buffer.length, 4);
  equals(console.buffer.last().method, 'info');
  equals(console.buffer.last().message, 'INFO l2 info message');

  l2.warn('l2 warn message');
  equals(console.buffer.length, 5);
  equals(console.buffer.last().method, 'warn');
  equals(console.buffer.last().message, 'WARN l2 warn message');
});
