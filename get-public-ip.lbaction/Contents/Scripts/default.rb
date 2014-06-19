#!/usr/bin/ruby
require 'open-uri'

public_ip = open('http://whatismyip.akamai.com').read
puts public_ip