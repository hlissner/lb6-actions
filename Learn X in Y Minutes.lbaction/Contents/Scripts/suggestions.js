/*global Lib,API*/

include("shared/lib/request.js");
include("shared/lib/cache.js");
include("shared/lib/lib.js");

var SITE_URL = "http://learnxinyminutes.com";
var CACHE_ID = "links";

function runWithString(string) {
    var data = Lib.Cache.get(CACHE_ID, true);
    if (!data || data.length == 0) {
        data = parse(Lib.Request.get(SITE_URL));
        if (data.length > 1)
            Lib.Cache.set(CACHE_ID, data, 86400);
    }

    return string.trim() === "" ? data : data.filter(function(item) {
        return item.title.toLowerCase().indexOf(string.toLowerCase()) !== -1;
    });
}

function parse(text) {
    var re = /<a href=["']\/docs\/([^\/]+)\/['"]>/gi;
    var match, params = [];

    while (match = re.exec(text)) {
        params.push({
            title: match[1].trim_nl(),
            icon: "iconTemplate"
        });
    }
    return params;
}
