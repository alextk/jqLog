# [jqLog]() - jQuery logging for javascript
================================

Log4J style logging for javasript using jQuery.

Dependecies
-------------------
Depends on latest version jqExt framework (Array enumerations and Date.strftime)


Installation
-------------------
Include in &lt;head&gt; section of the page latest jqext and jqlog javascript files:

    <script src="/javascripts/vendor/jquery.jqext.js" type="text/javascript"></script>
    <script src="/javascripts/vendor/jquery.jqlog.js" type="text/javascript"></script>


Theory
-------------------
Logging is about writing messages with certain level to various channels (console, remote server, file etc.).

**Logger** - is instance of $.jqLog.classes.Logger class, and is the primary interface for writing logging messages.
You should have more than one logger in you application, preferably one logger for each instance of class,
so when you write a message using that logger, you know where it comes from.

**Level** - message level: trace < debug < info < warn < error < fatal. The level are ordered, so if you've configured your logger to
output message on warn level, then error and fatal will also be written, while info,debug and trace will be ignored.
Each logger can have a different level, so if you're intereseted in debugging messages from some specific logger, you can configure it easily.

**Appender** - the channel to which messages are written. You can have multiple appenders active at the same time, for example writing
to console, to server and to html div.

**Layouter** - layouter is a class that is responsible for formatting the logging messages according to certain pattern. This gives you control
on how the message will look like (will it include logging level, will it include date, logger name etc).

Usage
-------------------

### Creating a logger ###
Use `$.jqLog.logger('my.LoggerName')` method, that will return instance of `$.jqLog.classes.Logger` class, that you can use to log messages. For example:

    var logger1 = $.jqLog.logger('org.mycompany.myClass1');
    var logger2 = $.jqLog.logger('org.mycompany.myClass2');

### Logging messages ###
Once you have a logger instance invoke `trace/debug/info/warn/error/fatal` methods on it to log message with that level:

    logger1.info('hello world'); //log message with INFO level
    logger1.warn('some weird stuff is going on'); //log message with WARN level

If you want to include parameters in the message string, you can use two syntaxes: object notation or array notation:
   
    //object notation (use either %{} or {} for parameter names in message)
    logger.debug('my debug message {p1} and {p2}', {p1: 'puki1', p2: 'puki2'}); //message will be: my debug message puki1 and puki2
    logger.debug('my debug message %{p1} and %{p2}', {p1: 'puki1', p2: 'puki2'}); //message will be: my debug message puki1 and puki2

    //array notation: use {0},{1},{2} or %{0},%{1},%{2} placeholders in message that will be replaced with arguments passed after the message:
    logger.debug('my debug message {0} and {1}', 'puki1', 'puki2'); //message will be: my debug message puki1 and puki2
    logger.debug('my debug message %{0} and %{1}', 'puki1', 'puki2'); //message will be: my debug message puki1 and puki2

### Layouter ###
You can configure custom layouter, that will format the messages beign logged, by the pattern you like. You pass a new instance
of layouter to configuration: `new $.jqLog.classes.Layouter(pattern, datePattern)` and can customize the message pattern and date pattern:

* **pattern** - pattern is a string with special placeholders that will be replaced for each message (like: "%{level} [%{name}] %{msg}").
Placeholders can be:
** %{level} - log level of the message (will be one of TRACE, DEBUG, etc)
** %{name} - name of the logger trough which the message was logged
** %{date} - the date message was logged (formatted according to date pattern)
** %{msg} - the message that was logged
* **datePattern** - %{date} placeholder in the pattern will be replaced with date formatted by this pattern (strftime format)

### Configuration ###
Use `$.jqLog.configure` and pass it with configuration hash that can have the following keys:

      $.jqLog.configure({
        layouter: new $.jqLog.classes.Layouter('message pattern', 'date pattern'),
        appenders: [appender1, appender2],
        loggers: {
          root: {level: Level.WARN},
          'com.yoyo.Logger2': {level: Level.DEBUG}
        }
      });

 * **loggers** - a hash of loggers configurations, when the key is the logger name, and the value is a hash of configuration for that logger. The logger configuration can have a **level** key that specifies a level for that logger.
 * **appenders** - array of appenders, to which the logging messages will be written. The values should be instances of appender class.
 * **layouter** - if you want to customize the message layout and date pattern you can pass layuter.

###Pattern of creating logger and using it inside a class###

    var org.mycompany.myClass = function() {
      this.initialize.apply(this, arguments);
    };

    $.extend(org.mycompany.myClass.prototype, {
      initialize: function() {
        this.logger = $.jqLog.logger('org.mycompany.myClass'); //create logger
      },

      someMethod: function(method, message) {
        this.logger.info('hello world'); //log message using INFO level
        this.logger.warn('some weird stuff is going on'); //log message using INFO level
      }
    });


Pre-compiled scripts
--------------------
If you're not interested in compiling your own version of jqLog, you can grab the pre-compiled scripts from the
[dist](https://github.com/alextk/jqLog/tree/master/dist/) directory and get started quickly. Otherwise, take a look below.


What you need to build jqLog
----------------------------
In order to build jqLog, you need to ruby 1.8.7, Node.js 0.2 or later, and git 1.7 or later.
(Earlier versions might work OK, but are not tested.)

`rego-js-builder` gem installed:

    gem install rego-js-builder


Windows users:

   Install [msysgit](https://code.google.com/p/msysgit/) (Full installer for official Git),
   [GNU make for Windows](http://gnuwin32.sourceforge.net/packages/make.htm).
   Next you gonna need to build node js exe file and then copy it into mingw/bin folder. To build node js follow this guide:
   (https://github.com/joyent/node/wiki/Building-node.js-on-mingw). To install c++/g++ compilers run:

   mingw-get install gcc g++ mingw32-make

   To install phyton, simply download it from link on the guide, and add it to PATH variable.


Building to a different directory
---------------------------------
If you want to build jqLog to a directory that is different from the default location, you need to edit the Rakefile.

Special thanks
--------------
Big shout-out to the jQuery team for providing the directory structure and base files for the git repo, as well as the base-files for the new NodeJS build system!