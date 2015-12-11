/*global Lib*/

include("shared/lib/lib.js");
include("shared/lib/notify.js");
include("shared/lib/url.js");

var API_URL = "http://api.imgur.com/2/upload";
var SS_PATH = "/tmp/send2imgur.png";

function run() {
    LaunchBar.execute("/usr/sbin/screencapture", "-i", "-t", "png", SS_PATH);
    return runWithPaths([SS_PATH]);
}

function runWithPaths(paths) {
    if (Action.preferences.api_key === undefined)
        Action.preferences.api_key = "26ff5c40cbedf50e7f81124ab473c1cc";

    try {
        var results = paths.map(upload);
        if (results.length > 0) {
            Lib.copy(results.join("\n"));
            LaunchBar.log(results.join("\n"));
        }
    } catch (err) {
        Lib.Notify.error(err);
    }

    return results.map(function(url) {
        return {title: url, url: url};
    });
}

function runWithItem(item) {
    return runWithPaths([item.path]);
}

//////////////////////////////////////////////

function upload(path) {
    var response = LaunchBar.execute('/usr/bin/curl',
                                     '-F', 'key='+Action.preferences.api_key,
                                     '-F', 'image=@'+path, API_URL);
    if (response.indexOf("<imgur_page>") === -1) {
        LaunchBar.log(response);
        throw "Malformed response";
    }

    return response.split("<imgur_page>")[1].split("</imgur_page>")[0];
}
