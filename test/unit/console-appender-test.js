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
  var appender = new $.jqLog.classes.ConsoleAppender({console: null});
  equals(appender.enabled, false);
  equals(appender.doAppend({level: $.jqLog.Level.DEBUG, message: 'debug message'}), false);
});

test("doAppend()", function() {
  var console = new $.jqLog.classes.ArrayConsole();
  
  var Level = $.jqLog.Level;
  var appender = new $.jqLog.classes.ConsoleAppender({console: console});
  equals(appender.enabled, true);

  ok(appender.doAppend({level: Level.DEBUG, message: 'debug message1'}));
  equals(console.buffer.last().method, 'debug');
  equals(console.buffer.last().message, 'debug message1');

  ok(appender.doAppend({level: Level.INFO, message: 'info message1'}));
  equals(console.buffer.last().method, 'info');
  equals(console.buffer.last().message, 'info message1');
});
