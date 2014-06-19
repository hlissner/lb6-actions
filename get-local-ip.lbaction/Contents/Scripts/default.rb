#!/usr/bin/ruby
require 'socket'

private_ip = Socket.ip_address_list.detect{|intf| intf.ipv4_private?}
puts private_ip.ip_address if private_ip