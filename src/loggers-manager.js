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

})(jQuery);