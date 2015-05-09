# TODO: Implement support for php/python dependencies

# @dest = "{*.lbaction,*.lbext/Contents/Resources/Actions/*.lbaction}"
@scripts = "/Contents/Scripts"
@dest = "{*.lbaction,*.lbext/Contents/Resources/Actions/*.lbaction}#{@scripts}"

verbose(false)

task :default => :update

desc "Copies shared js libraries to the actions that need them."
task :update => :clean do
    Dir.glob(@dest).each do |dir|
      dirname = dir.split(".lbaction").first
      next if ["shared", "extensions"].include? dirname

      scripts = "#{dirname}.lbaction#{@scripts}"

      puts "==> Checking #{dirname}.lbaction"

      libs = []
      grep("shared/.*\\.js", "'#{scripts}'/*.js").each do |libfile|
        libs.concat(grep("shared/.*\\.js", libfile)).push(libfile)
      end

      libs.uniq!
      libs.delete("")
      if libs.any? and not ENV['DEBUG']
        mkdir_p "#{scripts}/shared"
        libs.each { |lib| cp_r(lib, "#{dir}/#{lib}") }
      end

      puts libs.map {|l| "  * #{l}"}
    end
end

desc "Deletes all the shared js libraries in the actions"
task :clean do
    Dir.glob("#{@dest}/shared") do |dir|
        puts "==> Deleting #{dir.split("/")[1]}'s shared scripts"
        rm_rf dir unless ENV['DEBUG']
    end
    puts ""
end


def grep(search, glob)
    `grep -h 'include(.*#{search}.*);' #{glob} 2>/dev/null`.split("\n").map! do |line|
        line.split(%r{['"]})[1]
    end
end
