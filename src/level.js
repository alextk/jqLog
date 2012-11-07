(function($) {

  $.jqLog.Level = {
    TRACE: {num: 1, name: 'TRACE'},
    DEBUG: {num: 2, name: 'DEBUG'},
    INFO: {num: 3, name: 'INFO'},
    WARN: {num: 4, name: 'WARN'},
    ERROR: {num: 5, name: 'ERROR'},
    FATAL: {num: 6, name: 'FATAL'},

    isLower: function(levelToCheck, levelThatRestricts){
      if(levelThatRestricts && levelThatRestricts.num){
        return levelToCheck.num < levelThatRestricts.num;
      }
      return false;
    }

  };

})(jQuery);
