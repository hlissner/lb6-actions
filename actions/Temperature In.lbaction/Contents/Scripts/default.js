/*global Lib,API*/

include("shared/history.js");
include("shared/cache.js");
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
        var item = runWithString(location)[0];
        if (item) {
            item.subtitle = location + " | " + item.subtitle;
            return item;
        }
    });
}

function runWithString(address) {
    init();
    LaunchBar.debugLog("Searching for "+address);

    try {
        var results = Lib.Cache.get(address, true);
        if (!results || LaunchBar.options.shiftKey) {
            var resp = API.request(address);

            var temp = Action.preferences.use_metric ? "C" : "F";

            results = {
                title: resp.main.temp + "°" + temp,
                subtitle: resp.main.temp_min + "°"+temp+" - " + resp.main.temp_max + "°"+temp+" | Humidity: " + resp.main.humidity + "%",
                icon: "iconTemplate"
            };

            Lib.History.add(address);
            Lib.Cache.set(address, results, 600);
        }

        return [results];
    } catch (err) {
        Lib.Notify.error(err);
    }
}


function init() {
    if (Action.preferences.use_metric === undefined)
        Action.preferences.use_metric = true;

    if (Action.preferences.locations === undefined)
        Action.preferences.locations = [];
}
