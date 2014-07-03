include("cache.js");
include("api.js");

function run() {
    if (LaunchBar.options.alternateKey) {
        API.key();
        var path = Action.supportPath + "/Preferences.plist";
        return [{title: "Preferences.plist", path: path}];
    }

    if (Action.preferences.locations === undefined || Action.preferences.locations.length === 0) {
        return [
            {title: "You have no locations set."},
            {title: "How do I set it up?", url: "https://github.com/hlissner/launchbar6-scripts/tree/master/actions/Time%20In.lbaction/README.md", icon: "setup"}
        ];
    }

    var items = [];
    var item = {};
    Action.preferences.locations.forEach(function(location) {
        item = runWithString(location)[0];
        item.subtitle = location + " | " + item.subtitle;
        items.push(item);
    });

    return items;
}

function runWithString(address) {
    LaunchBar.debugLog("Searching for "+address);
    if (!address.trim()) return;

    try {
        var resp;
        var d = new Date();
        var ts = d.getTime();

        var apikey = API.key();
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
            icon: "clock2"
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
