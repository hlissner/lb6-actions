include("shared/notify.js");
include("shared/request.js");
include("shared/url.js");

function runWithString(url) {
    // Generate default preferences
    if (Action.preferences.api === undefined) {
        Action.preferences.api = {
            "url": "",
            "signature": ""
        };
    }
    if (LaunchBar.options.commandKey) {
        return Lib.Notify.force_prompt();
    }

    try {
        var shorturl = generateShortUrl(url);
        if (shorturl === "")
            return false;

        Lib.copy(shorturl);
        return {
            title: shorturl,
            subtitle: url,
            url: shorturl
        };
    } catch (err) {
        Lib.Notify.error(err);
    }
}

// ----------------------

function generateShortUrl(url) {
    if (Action.preferences.api.url === "" || Action.preferences.api.signature === "")
        throw "Your API Details are not filled in. Click Preferences " +
            "and enter your security token and URL to yourls-api.php. " +
            "You can find that information at http://YOUR-SHORT-URL/admin/tools" +
            "\n\nSee README.md for details.";

    var URL = Action.preferences.api.url + "?signature=" +
              Action.preferences.api.signature + "&format=simple&action=shorturl&url=" +
              encodeURIComponent(url);

    return Lib.Request.get(URL);
}
