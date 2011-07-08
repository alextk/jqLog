(function($) {

  $.jqLog.Level = {
    TRACE: 1,
    DEBUG: 2,
    INFO: 3,
    WARN: 4,
    ERROR: 5,
    FATAL: 6,

    isLower: function(levelToCheck, levelThatRestricts){
      if($.type(levelThatRestricts) === "number"){
        return levelToCheck < levelThatRestricts;
      }
      return false;
    }
  };

})(jQuery);
