#!/usr/bin/ruby
require 'open-uri'

resp = open("https://www.google.ca/search?q=time+in+#{ARGV[1]}")
resp.find { |line| 
    t = line.match('<div class="vk_bk vk_ans">\s+(.+)\s*</div>')
    if t == nil
        puts "No dice"
        puts resp
        puts t
        puts line
    else
        puts t[0]
    end
}
