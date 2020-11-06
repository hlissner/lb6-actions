/*global Lib*/

include("shared/lib/lib.js");
include("shared/lib/notify.js");
include("shared/lib/url.js");

var API_URL = "https://api.imgur.com/3/image";
var SS_PATH = "/tmp/send2imgur.png";

function run() {
    LaunchBar.execute("/usr/sbin/screencapture", "-i", "-t", "png", SS_PATH);
    return runWithPaths([SS_PATH]);
}

function runWithPaths(paths) {
    if (Action.preferences.clientID === undefined)
    // https://api.imgur.com/oauth2/addclient
        Action.preferences.clientID = "1ef24b069493622";

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
                                     '-F', 'image=@'+path,
                                     '-H', 'Authorization: Client-ID ' + Action.preferences.clientID,
                                     API_URL);
    responseObj = JSON.parse(response)
    if (typeof responseObj?.data?.link === "undefined") {
        LaunchBar.log(response);
        throw "Malformed response:" + response;
    }
    return responseObj.data.link;
}