/*
* jqLog - jQuery logging for javascript
*
* Version: 0.0.2
* Build: 49
* Copyright 2011 Alex Tkachev
*
* Dual licensed under MIT or GPLv2 licenses
*   http://en.wikipedia.org/wiki/MIT_License
*   http://en.wikipedia.org/wiki/GNU_General_Public_License
*
* Date: 28/07/2011 17:48:30
*/

(function($) {

  $.jqLog = {
    classes: {}
  };


})(jQuery);(function($) {

  $.jqLog.Level = {
    TRACE: 1,
    DEBUG: 2,
    INFO: 3,
    WARN: 4,
    ERROR: 5,
    FATAL: 6,

    isLower: function(levelToCheck, levelThatRestricts){
      if($.type(levelThatRestricts) === "number"){
        return levelToCheck < levelThatRestricts;
      }
      return false;
    }
  };

})(jQuery);
(function($) {

  $.jqLog.classes.Logger = function(){
    this.initialize.apply(this, arguments);
  };

  $.extend($.jqLog.classes.Logger.prototype, {

    initialize: function(config){
      $.extend(this, config);
    },

    log: function(level, message, params){
      if(this.jqLog.isLevelEnabled(this, level)){
        if(params){
          for(var key in params){
            message = message.replace("{"+key+"}", params[key]);
          }
        }
        this.jqLog.doAppend(this, level, message);
      }
    }

  });

  ['trace', 'debug', 'info', 'warn', 'error', 'fatal'].each(function(name){
    $.jqLog.classes.Logger.prototype[name] = function(){
      Array.prototype.unshift.call(arguments, $.jqLog.Level[name.toUpperCase()]);
      this.log.apply(this, arguments);
    };
  });

})(jQuery);
(function($) {

  $.jqLog.classes.LoggersManager = function() {
    this.initialize.apply(this, arguments);
  };
  $.extend($.jqLog.classes.LoggersManager.prototype, {

    loggers: null,
    rootLogger: null,

    initialize: function(jqLog) {
      this.jqLog = jqLog;
      this.reset();
    },

    reset: function() {
      this.loggers = {};
      //create root logger
      this.rootLogger = this.loggers._logger = new $.jqLog.classes.Logger({jqLog: this.jqLog, name: '', nameArr: [], level: $.jqLog.Level.DEBUG});
    },

    configure: function(options) {
      if(options.root){
        this.rootLogger.level = options.root.level;
      }
      //other loggers
      for(var name in options){
        if(name != 'root'){
          var loggerConfig = options[name];
          var logger = this.logger(name);
          if(loggerConfig.level) {
            logger.level = loggerConfig.level;
          }
        }
      }
    },

    logger: function(name) {
      if (!name || name.length === 0) {
        return this.rootLogger;
      }
      var nameArr = name.split('.');
      var tree = this.loggers;
      nameArr.each(function(key){
        if (!tree[key]) {
          tree[key] = {_logger: null};
        }
        tree = tree[key];
      });
      
      if (tree._logger === null) {
        tree._logger = new $.jqLog.classes.Logger({jqLog: this.jqLog, name: name, nameArr: nameArr});
      }
      return tree._logger;
    },

    isLevelEnabled: function(logger, level) {
      //if root level or logger level restricts - return false:
      //if level is lower that root or level is lower than logger level ==> then the level is disabled (return false)
      if ($.jqLog.Level.isLower(level, this.rootLogger.level) || $.jqLog.Level.isLower(level, logger.level)){
        return false;
      }

      //search parent loggers levels
      var tree = this.loggers;
      for (var i = 0; i < logger.nameArr.length; i++) {
        var key = logger.nameArr[i];
        if (tree[key]._logger && tree[key]._logger.level && $.jqLog.Level.isLower(level, tree[key]._logger.level)) {
          return false; //parent has logger and logger has level and logger's level is higher than checked level ==> return false
        }
        tree = tree[key];
      }
      return true;
    }

  });

})(jQuery);(function($) {

  $.jqLog.classes.ArrayConsole = function() {
    this.initialize.apply(this, arguments);
  };

  $.extend($.jqLog.classes.ArrayConsole.prototype, {
    
    enabled: true,

    initialize: function() {
      this.buffer = [];
    },

    log: function(method, message) {
      this[method](message);
    }
  });

  ['trace', 'debug', 'info', 'warn', 'error', 'fatal'].each(function(name) {
    $.jqLog.classes.ArrayConsole.prototype[name] = function(message) {
      this.buffer.push({method: name, message: message});
    };
  });

})(jQuery);(function($) {

  $.jqLog.classes.BrowserConsole = function() {
    this.initialize.apply(this, arguments);
  };

  $.extend($.jqLog.classes.BrowserConsole.prototype, {
    initialize: function() {
      this.console = console;
      this.enabled = typeof(this.console) !== 'undefined' && this.console !== null;
    },

    log: function(method, message) {
      this[method](message);
    }
  });

  ['trace', 'debug', 'info', 'warn', 'error'].each(function(name) {
    $.jqLog.classes.BrowserConsole.prototype[name] = function(message) {
      this.console[name](message);
    };
  });
  $.jqLog.classes.BrowserConsole.prototype.fatal = $.jqLog.classes.BrowserConsole.prototype.error; //browser console doesn't have fatal level

})(jQuery);(function($) {

  $.jqLog.classes.ConsoleAppender = function() {
    this.initialize.apply(this, arguments);
  };

  var Level = $.jqLog.Level;
  var map = {};
  ['trace', 'debug', 'info', 'warn', 'error', 'fatal'].each(function(name){ map[Level[name.toUpperCase()]] = name; });
  $.jqLog.classes.ConsoleAppender.loggingMethodForLevel = function(level){
    return map[level];
  };

  $.extend($.jqLog.classes.ConsoleAppender.prototype, {

    console: null,

    initialize: function(config) {
      $.extend(this, config);
      if(!this.console) this.console = new $.jqLog.classes.BrowserConsole();
    },

    doAppend: function(event){
      if(!this.console.enabled) return false;

      var loggingMethod = $.jqLog.classes.ConsoleAppender.loggingMethodForLevel(event.level);
      this.console[loggingMethod](event.message); //perform actual log
      return true;
    }

  });

})(jQuery);
(function($) {

  $.jqLog.classes.JQLog = function() {
    this.initialize.apply(this, arguments);
  };

  $.extend($.jqLog.classes.JQLog.prototype, {

    manager: null, //loggers manager
    appenders: null, //array of appenders
    rootLogger: null, //reference to root logger

    defaultConfig: null, //reference to default configuration that will be applied on reset

    initialize: function(config) {
      this.defaultConfig = config;
      this.reset();
    },

    reset: function() {
      this.manager = new $.jqLog.classes.LoggersManager(this);
      this.rootLogger = this.manager.rootLogger;
      this.appenders = [];
      this.configure(this.defaultConfig);
    },

    isLevelEnabled: function(logger, level) {
      return this.manager.isLevelEnabled(logger, level);
    },

    doAppend: function(logger, level, message) {
      var event = {date: new Date(), logger: logger, level: level, message: message};
      this.appenders.each(function(appender) {
        appender.doAppend(event);
      });
    },

    logger: function(name) {
      return this.manager.logger(name);
    },

    configure: function(options) {
      if (options.loggers) {
        this.manager.configure(options.loggers);
      }
      if (options.appenders) {
        this.appenders = options.appenders;
      }
    }
  });

  $.extend($.jqLog, {
    defaults: {
      appenders: [new $.jqLog.classes.ConsoleAppender()],
      loggers: {
        root: {level: $.jqLog.Level.DEBUG}
      }
    }
  });

  var API = (function() {
    var instance = new $.jqLog.classes.JQLog($.jqLog.defaults);

    return {
      _instance: instance,

      rootLogger: function() {
        return instance.rootLogger;
      },

      logger: function(name) {
        return instance.logger(name);
      },

      configure: function(options) {
        instance.configure(options);
      }
    };
  })();

  $.extend($.jqLog, API);


})(jQuery);

