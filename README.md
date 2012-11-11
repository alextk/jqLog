# [jqLog]() - jQuery logging for javascript
================================

Log4J style logging for javasript using jQuery.

Dependecies
-------------------
Depends on latest version jqExt framework (Array enumerations and Date.strftime)


Installation
-------------------
Include in &lt;head&gt; section of the page latest jqext and jqlog javascript files:

    <script src="/javascripts/vendor/jquery.jqext.js" type="text/javascript"></script>
    <script src="/javascripts/vendor/jquery.jqlog.js" type="text/javascript"></script>


Theory & Usage
-------------------
Logging is about writing messages with certain level to various channels (console, remote server, file etc.).

'Logger' - is instance of $.jqLog.classes.Logger class, and is the primary interface for writing logging messages.
You should have more than one logger in you application, preferably one logger for each instance of class,
so when you write a message using that logger, you know where it comes from.

'Level' - message level: trace < debug < info < warn < error < fatal. The level are ordered, so if you've configured your logger to
output message on warn level, then error and fatal will also be written, while info,debug and trace will be ignored.

'Appender' - the channel to which messages are written. You can have multiple appenders active at the same time, for example writing
to console, to server and to html div.


Pre-compiled scripts
--------------------
If you're not interested in compiling your own version of jqLog, you can grab the pre-compiled scripts from the
[dist](https://github.com/alextk/jqLog/tree/master/dist/) directory and get started quickly. Otherwise, take a look below.


What you need to build jqLog
----------------------------
In order to build jqLog, you need to ruby 1.8.7, Node.js 0.2 or later, and git 1.7 or later.
(Earlier versions might work OK, but are not tested.)

`rego-js-builder` gem installed:

    gem install rego-js-builder


Windows users:

   Install [msysgit](https://code.google.com/p/msysgit/) (Full installer for official Git),
   [GNU make for Windows](http://gnuwin32.sourceforge.net/packages/make.htm).
   Next you gonna need to build node js exe file and then copy it into mingw/bin folder. To build node js follow this guide:
   (https://github.com/joyent/node/wiki/Building-node.js-on-mingw). To install c++/g++ compilers run:

   mingw-get install gcc g++ mingw32-make

   To install phyton, simply download it from link on the guide, and add it to PATH variable.


Building to a different directory
---------------------------------
If you want to build jqLog to a directory that is different from the default location, you need to edit the Rakefile.

Special thanks
--------------
Big shout-out to the jQuery team for providing the directory structure and base files for the git repo, as well as the base-files for the new NodeJS build system!