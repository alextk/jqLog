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
