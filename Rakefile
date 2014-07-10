# TODO: Implement support for php/python dependencies

@dest = "actions/{*.lbaction,*.lbext/Contents/Resources/Actions/*.lbaction}/Contents/Scripts"

verbose(false)

task :default => :update

desc "Copies shared js libraries to the actions that need them."
task :update => :clean do
    Dir.glob(@dest).each do |dir|
        puts "==> Checking #{dir.scan(/\/([^\/]+\.lbaction)\//).last.first}"

        libs = []
        grep("shared/.*\\.js", "'#{dir}'/*.js").each do |libfile|
            libs.concat(grep("shared/.*\\.js", libfile)).push(libfile)
        end

        libs.delete("")
        libs.uniq!
        if libs.any? and not ENV['DEBUG']
            mkdir_p "#{dir}/shared"
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
