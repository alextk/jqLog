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

    // return level for this logger that is inherited from its parents (all the way up to rootLogger)
    inheritedLoggerLevel: function(logger){
      if(logger == this.rootLogger) return this.rootLogger.level;
      //search parent loggers levels
      var tree = this.loggers;
      for (var i = 0; i < logger.nameArr.length; i++) {
        var key = logger.nameArr[i];
        if (tree[key]._logger && tree[key]._logger.level) { //has parent, and parent logger level is set
          return tree[key]._logger.level
        }
        tree = tree[key];
      }
      return this.rootLogger.level;
    },

    //If logger has its own level set, limit by that level
    //If logger has no level set, limit by parent level logger (or root logger if no parent has a specific level set)
    isLevelEnabled: function(logger, level) {
      if(logger.level) return !$.jqLog.Level.isRestricted(level, logger.level); //loger has its own level set

      return !$.jqLog.Level.isRestricted(level, this.inheritedLoggerLevel(logger)); //logger has no own level set, restrict by its parents
    }

  });

})(jQuery);