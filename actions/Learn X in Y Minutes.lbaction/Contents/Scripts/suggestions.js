include("shared/request.js");
include("shared/cache.js");
include("shared/lib.js");

var SITE_URL = "http://learnxinyminutes.com";
var CACHE_ID = "links";

function runWithString(string) {
    var data = Lib.Cache.get(CACHE_ID, true);
    if (!data || LaunchBar.options.controlKey) {
        data = parse(Request.get(SITE_URL));

        Lib.Cache.set(CACHE_ID, data, 86400*7);
    }

    return string.trim() === "" ? data : data.filter(function(item) {
        return item.title.toLowerCase().indexOf(string.toLowerCase()) !== -1;
    });
}

function parse(text) {
    var re = /<a\s+href\s*=\s*["']\/docs\/([^'"\/]+)\/['"][^>]*>\s*([^<]+)\s*<\/a>/gi;
    var match, params = [];

    while (match = re.exec(text)) {
        params.push({
            title: match[2].trim_nl(),
            icon: "iconTemplate"
        });
    }
    return params;
}
