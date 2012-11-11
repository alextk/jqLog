module("Level");

test("Basic requirements", function() {
  ok( $.jqLog.Level, "$.jqLog.Level not present" );

});

test("isLower()", function() {
  var Level = $.jqLog.Level;
  equals(false, Level.isLower(Level.DEBUG, Level.DEBUG));
  equals(true, Level.isLower(Level.DEBUG, Level.INFO));
  equals(true, Level.isLower(Level.DEBUG, Level.WARN));
  equals(true, Level.isLower(Level.DEBUG, Level.ERROR));
  equals(true, Level.isLower(Level.DEBUG, Level.FATAL));
});

test("isRestricted()", function() {
  var Level = $.jqLog.Level;
  equals(false, Level.isRestricted(Level.DEBUG, Level.DEBUG));
  equals(true, Level.isRestricted(Level.DEBUG, Level.INFO));
  equals(true, Level.isRestricted(Level.DEBUG, Level.WARN));
  equals(true, Level.isRestricted(Level.DEBUG, Level.ERROR));
  equals(true, Level.isRestricted(Level.DEBUG, Level.FATAL));
});