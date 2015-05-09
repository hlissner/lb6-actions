#!/usr/bin/ruby

require 'rexml/document'
require 'json'

search = ARGV[0]
if search =~ /^[a-z0-9_-`]+ /i
  search = search.split(" ", 2).join(":")
end

output = `./dash '#{search}'`
xml_document = REXML::Document.new(output)

items = []

xml_document.elements.each('items/item') do | element |
    if element.attributes['valid'] == 'no'
        next
    end

    item = {}
    item['title'] = element.elements['title'].text
    item['subtitle'] = element.get_elements('subtitle[not(@*)]')[0].text
    item['icon'] = element.elements['icon'].text
    item['url'] = 'dash-workflow-callback://' + element.attributes['arg']
    items.push item
end

puts items.to_json
