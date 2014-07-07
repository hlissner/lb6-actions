/**
 * TODO: Add timezone in subtitle
 */

include("shared/notify.js");
include("api.js");

function run() {
    var path = Action.supportPath + "/Preferences.plist";
    if (LaunchBar.options.controlKey) {
        API.key();
        Action.preferences.locations = Action.preferences.locations || [];
        return [{title: "Preferences", path: path}];
    }

    if (!Action.preferences.locations || Action.preferences.locations.length === 0) {
        return [
            {title: "You have no locations set"},
            {title: "Preferences", path: path}
        ];
    }

    return Action.preferences.locations.map(function(location) {
        var item = runWithString(location)[0];
        item.subtitle = location + " | " + item.subtitle;

        return item;
    });
}

function runWithString(address) {
    LaunchBar.debugLog("Searching for "+address);

    try {
        var d = new Date();
        var ts = d.getTime();

        var coords = API.coordinates(address);
        var tzdata = API.tzdata(ts, coords.lat, coords.lng);
        
        var ts2 = ts + ((tzdata.dstOffset + tzdata.rawOffset) * 1000) + (d.getTimezoneOffset() * 60000);
        var diff = (ts2 - ts) / (1000 * 60 * 60);

        // Formatting
        var diffline = diff !== 0
            ? Math.abs(diff) + " " + (diff > 0 ? "hr(s) ahead" : "hr(s) behind")
            : "Same timezone";

        var time = new Date(ts2);
        var offset = (tzdata.rawOffset+tzdata.dstOffset)/3600;
        return [{
            title: _format(time),
            subtitle: tzdata.timezone + " (GMT " + (offset >= 0 ? "+"+offset : offset) + ") | " + diffline,
            icon: "clockTemplate"
        }];
    } catch (err) {
        Notify.error(err instanceof Object ? err.message : err);
    }
}

/////////////////////

function _format(time) {
    var hr = time.getHours();
    var hour = (hr % 12);
    hour = hour ? hour : 12;

    return ("0" + hour).slice(-2) + ":" +
        ("0" + time.getMinutes()).slice(-2) + " " + (hr >= 12 ? "PM" : "AM");
}
