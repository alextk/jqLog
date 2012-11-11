(function($) {

  $.jqLog.Level = {
    TRACE: {num: 1, name: 'TRACE'},
    DEBUG: {num: 2, name: 'DEBUG'},
    INFO: {num: 3, name: 'INFO'},
    WARN: {num: 4, name: 'WARN'},
    ERROR: {num: 5, name: 'ERROR'},
    FATAL: {num: 6, name: 'FATAL'},

    // note that levelThatRestricts can be undefined, if it is undefined the it restricts
    isLower: function(levelToCheck, levelThatRestricts){
      if(levelThatRestricts && levelThatRestricts.num){
        return levelToCheck.num < levelThatRestricts.num;
      }
      return false;
    },

    // return true if given levelToCheck is restricted by given levelThatRestricts
    isRestricted: function(levelToCheck, levelThatRestricts){
      return levelToCheck.num < levelThatRestricts.num;
    }


  };

})(jQuery);
