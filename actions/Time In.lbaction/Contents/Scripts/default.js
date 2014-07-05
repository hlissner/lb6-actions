include("shared/lib.js");
include("api.js");

function run() {
    var path = Action.supportPath + "/Preferences.plist";
    if (LaunchBar.options.controlKey) {
        API.key();
        Action.preferences.locations = Action.preferences.locations || [];
        return [{title: "Preferences.plist", path: path}];
    }

    if (Action.preferences.locations === undefined || Action.preferences.locations.length === 0)
        return [{title: "You have no locations set", subtitle: "Run this action to open your preferences", path: path}];

    var items = [];
    Action.preferences.locations.forEach(function(location) {
        var item = runWithString(location)[0];
        item.subtitle = location + " | " + item.subtitle;
        items.push(item);
    });

    return items;
}

function runWithString(address) {
    LaunchBar.debugLog("Searching for "+address);

    try {
        var resp;
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
        return [{
            title: _format(time),
            subtitle: diffline,
            icon: "clockTemplate"
        }];
    } catch (err) {
        var msg;
        if (err !== undefined && err instanceof Object) {
            msg = err.message;
            LaunchBar.log("Error: " + err.log);
            LaunchBar.log("Response: " + JSON.stringify(err.resp));
        }
        else msg = err;

        LaunchBar.displayNotification({title: "LaunchBar Error", string: msg});
    }
}

/////////////////////

function _format(time) {
    return ("0" + time.getHours()).slice(-2) + ":" +
        ("0" + time.getMinutes()).slice(-2) + ":" +
        ("0" + time.getSeconds()).slice(-2) + " ";
}
