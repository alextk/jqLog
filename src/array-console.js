(function($) {

  $.jqLog.classes.ArrayConsole = function() {
    this.initialize.apply(this, arguments);
  };

  $.extend($.jqLog.classes.ArrayConsole.prototype, {
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
    }
  });

})(jQuery);