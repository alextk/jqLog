(function($) {

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
