require 'rubygems'
gem 'rego-ruby-ext'
require "rego-ruby-ext"
gem 'rego-js-builder'
require "rego-js-builder"

project = JsProjectBuilder.new(
  :name => 'jqLog',
  :description => 'jQuery logging for javascript',
  :file_name => 'jquery.jqlog.js'
)
JsProjectBuilder::Tasks.new(project)


desc 'Join all javascript files into one joined file with version and license at the head'
task :js => :prepare do
  puts "Building single js file: #{project.dist_file_name}"

  files = FileList[%w{base.js level.js logger.js loggers-manager.js array-console.js browser-console.js console-appender.js jqlog.js}.collect{|n| File.join('src', n)}]
  project.join_files(project.dist_file_path, files)
  #Rake::Task['utils:join_files'].invoke(project.dist_file_path, files)
end

