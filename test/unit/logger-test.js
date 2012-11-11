module("logger");

test("simple logging with levels", function() {
  var Level = $.jqLog.Level;

  var console = new $.jqLog.classes.ArrayConsole();
  var appender = new $.jqLog.classes.ConsoleAppender({console: console});

  $.jqLog.configure({
    appenders: [appender],
    loggers: {
      root: {level: Level.TRACE},
    }
  });

  var root = $.jqLog.logger();

  root.trace('my trace message');
  equals(console.buffer.last().method, 'trace');
  equals(console.buffer.last().message, 'TRACE my trace message');


  root.debug('my debug message');
  equals(console.buffer.last().method, 'debug');
  equals(console.buffer.last().message, 'DEBUG my debug message');


  root.info('my info message');
  equals(console.buffer.last().method, 'info');
  equals(console.buffer.last().message, 'INFO my info message');


  root.warn('my warn message');
  equals(console.buffer.last().method, 'warn');
  equals(console.buffer.last().message, 'WARN my warn message');


  root.error('my error message');
  equals(console.buffer.last().method, 'error');
  equals(console.buffer.last().message, 'ERROR my error message');


  root.fatal('my fatal message');
  equals(console.buffer.last().method, 'fatal');
  equals(console.buffer.last().message, 'FATAL my fatal message');

});

test("message parameters as object", function() {
  var Level = $.jqLog.Level;

  var console = new $.jqLog.classes.ArrayConsole();
  var appender = new $.jqLog.classes.ConsoleAppender({console: console});

  $.jqLog.configure({
    appenders: [appender],
    loggers: {
      root: {level: Level.TRACE},
    }
  });

  var root = $.jqLog.logger();

  root.debug('my debug message {p1} and {p2}', {p1: 'puki1', p2: 'puki2'});
  equals(console.buffer.last().method, 'debug');
  equals(console.buffer.last().message, 'DEBUG my debug message puki1 and puki2');

  root.debug('my debug message %{p1} and %{p2}', {p1: 'puki1', p2: 'puki2'});
  equals(console.buffer.last().method, 'debug');
  equals(console.buffer.last().message, 'DEBUG my debug message puki1 and puki2');

  root.debug('my debug message {0} and {1}', 'puki1', 'puki2');
  equals(console.buffer.last().method, 'debug');
  equals(console.buffer.last().message, 'DEBUG my debug message puki1 and puki2');

  root.debug('my debug message %{0} and %{1}', 'puki1', 'puki2');
  equals(console.buffer.last().method, 'debug');
  equals(console.buffer.last().message, 'DEBUG my debug message puki1 and puki2');

});
