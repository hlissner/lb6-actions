@shared = "shared/*.js"
@dest = "actions/*.lbaction/Contents/Scripts/*.js"

verbose(false)

task :default => :update

task :update => :clean do
    last = ""
    Dir.glob(@dest).each do |file|
        action = file.split("/")[1]

        puts "==> Checking #{action}" unless last == action
        last = action

        scripts_dir = File.dirname(file)
        shared_dir = "#{scripts_dir}/shared"

        Dir.glob(@shared).each do |lib|
            sh "grep 'include(\s*.#{lib}.\s*);' '#{file}' >/dev/null 2>&1" do |ok,res|
                if ok
                    puts "    * #{lib} in #{File.basename(file)}"
                    mkdir_p shared_dir
                    cp lib, "#{scripts_dir}/#{lib}"
                end
            end
        end
    end
end

task :clean do
    Dir.glob("actions/*.lbaction/Contents/Scripts/shared") do |dir|
        puts "==> Deleting #{dir.split("/")[1]}'s shared scripts"
        rm_rf dir
    end
end
