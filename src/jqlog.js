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

