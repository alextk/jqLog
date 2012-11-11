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
        if(arguments.length == 3 && typeof params == 'object'){ //last parameter is parameters hash
          for(var key in params){
            message = message.replace("%{"+key+"}", params[key]).replace("{"+key+"}", params[key]);
          }
        } else if(arguments.length > 2){ //treat last arguments as array notation has, like: .info("my message {0}, {1} and {2}", 'p1', 'p2', 'p3')
          for(var i=2; i<arguments.length; i++){
            message = message.replace("%{"+(i-2)+"}", arguments[i]).replace("{"+(i-2)+"}", arguments[i]);
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
