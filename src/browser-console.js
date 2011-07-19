(function($) {

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

})(jQuery);