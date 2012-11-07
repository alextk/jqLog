require 'rubygems'
gem 'rego-ruby-ext'
require "rego-ruby-ext"
gem 'rego-js-builder'
require "rego-js-builder"

project = JsProjectBuilder.new(
  :name => 'jqLog',
  :description => 'jQuery logging for javascript',
  :file_name => 'jquery.jqlog.js',
  :js_files => %w{base.js level.js layouter.js logger.js loggers-manager.js array-console.js browser-console.js console-appender.js jqlog.js}
)
JsProjectBuilder::Tasks.new(project)
