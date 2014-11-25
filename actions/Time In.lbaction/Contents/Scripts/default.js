/*global Lib,API*/

include("shared/notify.js");

include("api.js");

function run() {
    init();
    var path = Action.supportPath + "/Preferences.plist";
    if (LaunchBar.options.controlKey) {
        API.key();
        return [{title: "Preferences", path: path}];
    }

    if (Action.preferences.locations.length === 0) {
        return [
            {title: "You have no locations set"},
            {title: "Preferences", path: path}
        ];
    }

    return Action.preferences.locations.map(function(location) {
        var item = runWithString(location);
        item.subtitle = location + " | " + item.subtitle;

        return item;
    });
}

function runWithString(address) {
    init();
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
        var hr = time.getHours();
        return {
            title: Action.preferences.format_24hours ? Time.format24(time) : Time.format(time),
            subtitle: tzdata.timezone + " (GMT " + (offset >= 0 ? "+"+offset : offset) + ") | " + diffline,
            icon: (hr < 6 || hr > 21 ? "N" : "D") + "clockTemplate"
        };
    } catch (err) {
        Lib.Notify.error(err instanceof Object ? err.message : err);
    }
}

function init() {
    if (Action.preferences.locations === undefined)
        Action.preferences.locations = [];

    if (Action.preferences.format_24hours === undefined)
        Action.preferences.format_24hours = false;

    if (Action.preferences.show_seconds === undefined)
        Action.preferences.show_seconds = false;
}

/////////////////////

var Time = {
    format: function (time) {
        var hr = time.getHours();
        var hour = (hr % 12);
        hour = hour ? hour : 12;

        return ("0" + hour).slice(-2) + ":" +
            ("0" + time.getMinutes()).slice(-2) +
            (Action.preferences.show_seconds ? ":" + ("0" + time.getSeconds()).slice(-2) : "") +
            " " + (hr >= 12 ? "PM" : "AM");
    },

    format24: function(time) {
        return ("0" + time.getHours()).slice(-2) + ":" +
            ("0" + time.getMinutes()).slice(-2) +
            (Action.preferences.show_seconds ? ":" + ("0" + time.getSeconds()).slice(-2) : "");
    }
};
