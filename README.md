# [jqLog]() - jQuery logging for javascript
================================

Dependecies
-------------------
Depends on jqExt framework (array enumerations)


Pre-compiled scripts
--------------------
If you're not interested in compiling your own version of jqLog, you can grab the pre-compiled scripts from the
[dist](https://github.com/alextk/jqLog/tree/master/dist/) directory and get started quickly. Otherwise, take a look below.


What you need to build jqLog
----------------------------
In order to build jqLog, you need to ruby 1.8.7, Node.js 0.2 or later, and git 1.7 or later.
(Earlier versions might work OK, but are not tested.)

`rego-js-builder` gem installed:

  rake
  gem install rego-js-builder


Windows users:

   Install [msysgit](https://code.google.com/p/msysgit/) (Full installer for official Git),
   [GNU make for Windows](http://gnuwin32.sourceforge.net/packages/make.htm).
   Next you gonna need to build node js exe file and then copy it into mingw/bin folder. To build node js follow this guide:
   (https://github.com/joyent/node/wiki/Building-node.js-on-mingw). To install c++/g++ compilers run:

   mingw-get install gcc g++ mingw32-make

   To install phyton, simply download it from link on the guide, and add it to PATH variable.



How to build jqLog
------------------
First, clone a copy of the main jqLog git repo by running `git clone git@github.com:alextk/jqLog.git`.

Then, in the main directory of the distribution (the one that this file is in), type
the following to build jqLog:

  rake

You can also create each individually using these commands:

	rake js		# Build non-minified jqLog source
	rake min 		# Build minified JS and CSS
	rake pack		# Build minified and packed jqLog JS (smallest filesize!)

To build and test the source code against JSLint type this:

	rake hint

Finally, you can remove all the built files using the command:

	rake clobber


Building to a different directory
---------------------------------
If you want to build jqLog to a directory that is different from the default location, you need to edit the Rakefile.

Special thanks
--------------
Big shout-out to the jQuery team for providing the directory structure and base files for the git repo, as well as the base-files for the new NodeJS build system!