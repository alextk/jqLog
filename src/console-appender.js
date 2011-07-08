(function($) {

  $.jqLog.classes.ConsoleAppender = function() {
    this.initialize.apply(this, arguments);
  };

  var Level = $.jqLog.Level;
  var map = {};
  ['trace', 'debug', 'info', 'warn', 'error', 'fatal'].each(function(name){ map[Level[name.toUpperCase()]] = name; });
  $.jqLog.classes.ConsoleAppender.loggingMethodForLevel = function(level){
    return map[level] || 'debug';
  };

  $.extend($.jqLog.classes.ConsoleAppender.prototype, {

    console: console,

    initialize: function(config) {
      $.extend(this, config);
      this.enabled = this.hasConsole();
    },

    doAppend: function(event){
      if(!this.enabled){
        return false;
      }
      
      var loggingMethod = $.jqLog.classes.ConsoleAppender.loggingMethodForLevel(event.level);
      //perform actual log
      this.console[loggingMethod](event.message);
      return true;
    },

    hasConsole: function() {
      return typeof(this.console) !== 'undefined' && this.console !== null;
    }

  });

})(jQuery);
