(function($) {

  $.jqLog.classes.Layouter = function() {
    this.initialize.apply(this, arguments);
  };

  $.extend($.jqLog.classes.Layouter.prototype, {

    /*
      Formats the logging message according to given pattern and date pattern. Pattern can include the following placeholders:
      %{level} - log level
      %{name} - log name
      %{date} - log date (formatted according to date pattern)
      %{msg} - the message that was logged

      config.pattern - string of the pattern, like: "%{level} [%{name}] %{msg}"
      config.datePattern - %{date} placeholder in the pattern will be replaced with date formatted by this pattern
    */
    initialize: function(config) {
      this.datePattern = '%d-%m-%y %H:%M:%S';
      this.pattern = '%{level} %{msg}';
      $.extend(this, config);
    },

    eventToString: function(event){
      return this.pattern.replace("%{level}", event.level.name).replace("%{name}", event.logger.name).replace("%{date}", event.date.strftime(this.datePattern)).replace("%{msg}", event.message);
    }

  });

})(jQuery);
