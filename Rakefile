require "rubygems"
require 'html-proofer'
require 'jekyll'

desc "Lint project"
task :lint do
  lintBuildPid = Process.spawn("grunt lint")

  trap("INT") {
    [lintBuildPid].each { |pid| Process.kill(9, pid) rescue Errno::ESRCH }
    exit 0
  }

  [lintBuildPid].each { |pid| Process.wait(pid) }
end

desc "Build JS"
task :buildjs do
  gruntBuildPid = Process.spawn("grunt build")

  trap("INT") {
    [gruntBuildPid].each { |pid| Process.kill(9, pid) rescue Errno::ESRCH }
    exit 0
  }

  [gruntBuildPid].each { |pid| Process.wait(pid) }
end

desc "Build project"
task :buildjekyil do
  config = Jekyll.configuration({
    'source' => './',
    'destination' => './_site'
  })
  site = Jekyll::Site.new(config)
  Jekyll::Commands::Build.build site, config
end

desc "Test project"
task :test do
  opts = { :disable_external => true }
  HTMLProofer.check_directory("./_site", opts).run
end

task :build => [:buildjs, :buildjekyil]
task :default => [:lint, :build, :test]
