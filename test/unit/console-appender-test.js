module("ConsoleAppender");

test("Basic requirements", function() {
  ok($.jqLog.classes.ConsoleAppender, "$.jqLog.classes.ConsoleAppender not present");
});

test("loggingMethodForLevel()", function() {
  var Level = $.jqLog.Level;
  var loggingMethodForLevel = $.jqLog.classes.ConsoleAppender.loggingMethodForLevel;
  equals('trace', loggingMethodForLevel(Level.TRACE));
  equals('debug', loggingMethodForLevel(Level.DEBUG));
  equals('info', loggingMethodForLevel(Level.INFO));
  equals('warn', loggingMethodForLevel(Level.WARN));
  equals('error', loggingMethodForLevel(Level.ERROR));
  equals('fatal', loggingMethodForLevel(Level.FATAL));
});

test("enabled", function(){
  var appender = new $.jqLog.classes.ConsoleAppender();
  ok(appender.console instanceof $.jqLog.classes.BrowserConsole);
  equals(appender.doAppend({level: $.jqLog.Level.DEBUG, message: 'debug message', date: new Date(), logger: $.jqLog.rootLogger()}), true);
  appender.console.enabled = false;
  equals(appender.doAppend({level: $.jqLog.Level.DEBUG, message: 'debug message', date: new Date(), logger: $.jqLog.rootLogger()}), false);
});

test("doAppend()", function() {
  var console = new $.jqLog.classes.ArrayConsole();
  
  var Level = $.jqLog.Level;
  var appender = new $.jqLog.classes.ConsoleAppender({console: console});
  ok(appender.console instanceof $.jqLog.classes.ArrayConsole);
  equals(appender.console.enabled, true);

  ok(appender.doAppend({level: $.jqLog.Level.DEBUG, message: 'debug message1', date: new Date(), logger: $.jqLog.rootLogger()}));
  equals(console.buffer.last().method, 'debug');
  equals(console.buffer.last().message, 'DEBUG debug message1');

  ok(appender.doAppend({level: $.jqLog.Level.INFO, message: 'info message1', date: new Date(), logger: $.jqLog.rootLogger()}));
  equals(console.buffer.last().method, 'info');
  equals(console.buffer.last().message, 'INFO info message1');
});
