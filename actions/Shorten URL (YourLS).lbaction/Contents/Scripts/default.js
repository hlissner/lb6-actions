include("shared/notify.js");
include("shared/request.js");
include("shared/url.js");

function runWithString(url) {
    if (Action.preferences.api === undefined) {
        Action.preferences.api = {
            "url": "",
            "signature": ""
        };
    }
    if (LaunchBar.options.controlKey)
        return {path: Action.supportPath + "/Preferences.plist"};

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
        throw "API settings aren't set. Hold control while running this action to select preferences file.";

    var URL = Action.preferences.api.url + "?signature=" + 
              Action.preferences.api.signature + "&format=simple&action=shorturl&url=" +
              encodeURIComponent(url);

    return Lib.Request.get(URL);
}
