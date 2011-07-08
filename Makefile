SRC_DIR = src
BUILD_DIR = build

PREFIX = .
DIST_DIR = ${PREFIX}/dist

JS_FILES = license.txt\
	${SRC_DIR}/base.js\
	${SRC_DIR}/level.js\
	${SRC_DIR}/logger.js\
	${SRC_DIR}/loggers-manager.js\
	${SRC_DIR}/arrau-console.js\
	${SRC_DIR}/console-appender.js\
	${SRC_DIR}/jqlog.js

JQEXT = ${DIST_DIR}/jquery.jqlog.js
JQEXT_MIN = ${DIST_DIR}/jquery.jqlog.min.js
JQEXT_PACK = ${DIST_DIR}/jquery.jqlog.pack.js

JS_ENGINE ?= `which node nodejs`
COMPILER = ${JS_ENGINE} ${BUILD_DIR}/uglify.js --unsafe
MINIFIER = java -Xmx96m -jar ${BUILD_DIR}/yuicompressor.jar
PACKER = java -jar ${BUILD_DIR}/rhino.jar ${BUILD_DIR}/packer.js
JSDOC = /c/devl/js/tools/jsdoc-toolkit-2.4.0
ANT_HOME = /c/devl/java/tools/apache-ant-1.7.0/bin/ant
JGROUSE_DOC = /c/devl/js/tools/jGrouseDoc-2.1


VERSION = `cat version.txt`
DATE = `git log --pretty=format:'%ad' -1`

all: clean jqlog lint min pack doc
	@@echo "done"

doc: 
	@@echo "Creating documentation using jsdoc-toolkit...."
#	java -Djsdoc=${JSDOC} -jar ${JSDOC}/jsrun.jar ${JSDOC}/app/run.js -t=${JSDOC}/templates/jsdoc -r -a -d=./dist/docs ./src/
	${ANT_HOME} -Dbasedir=. -DjGrouseHome=${JGROUSE_DOC} -DoutputDir=${DIST_DIR}/docs -DinputDir=${SRC_DIR} -f ${JGROUSE_DOC}/build.xml
	
build/create_dist: 
	@@mkdir -p ${DIST_DIR}

#join all files into one, add version and licence to the head of the file	
jqlog: build/create_dist
	@@echo "Building" ${JQEXT}
#	join all files into one | replace @Date variable with date command eval | replace @VERSION variable with version number
	@@cat ${JS_FILES} | sed 's/@DATE/'"${DATE}"'/' | sed s/@VERSION/${VERSION}/ > ${JQEXT}
	
#run JSLint checks on the joined file (using node.js)
lint: jqlog
	@@if test ! -z ${JS_ENGINE}; then \
		echo "Checking jQuery against JSLint..."; \
		${JS_ENGINE} $(BUILD_DIR)/jslint-check.js ${JQEXT} ; \
	else \
		echo "You must have NodeJS installed in order to test JQEXT against JSLint."; \
	fi
	
#run node.js with uglify script that compresses the js, remove all comments. add copyright notice to the head of the file (head -12)
min: jqlog
	@@if test ! -z ${JS_ENGINE}; then \
		echo "Building" ${JQEXT_MIN}; \
		head -12 ${JQEXT} > ${JQEXT_MIN}; \
		${COMPILER} ${JQEXT} > ${JQEXT_MIN}.tmp; \
		sed '$ s#^\( \*/\)\(.\+\)#\1\n\2;#' ${JQEXT_MIN}.tmp >> ${JQEXT_MIN}; \
		rm -rf $(JQEXT_MIN).tmp; \
	else \
		echo "You must have NodeJS installed in order to minify JS."; \
	fi

#run rhino server and pack minified js file into even smaller size. add copyright notice at the start (head -12)
pack: min
	@@echo "Building" ${JQEXT_PACK}

	@@head -12 ${JQEXT} > ${JQEXT_PACK}
	@@${PACKER} ${JQEXT_MIN} ${JQEXT_PACK}.tmp
	@@cat ${JQEXT_PACK}.tmp >> ${JQEXT_PACK} && rm ${JQEXT_PACK}.tmp

clean:
	@@echo "Removing distribution directory:" ${DIST_DIR}
	@@rm -rf ${DIST_DIR}
