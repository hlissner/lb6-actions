require 'fileutils'

@shared = "./shared"
@dest = "./actions/*.lbaction/Contents/Scripts/shared"

task :default => :update

task :update do
    Dir.glob(@dest).each do |dir|
        FileUtils.rm_rf(dir)
        FileUtils.cp_r("shared", dir)
        # puts dir
    end
end
