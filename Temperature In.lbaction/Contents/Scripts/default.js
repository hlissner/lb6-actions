/*global Lib,API*/

include("shared/lib/history.js");
include("shared/lib/cache.js");
include("shared/lib/notify.js");

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
        if (item) {
            return {
                title: item[0].title,
                subtitle: location + " | " + item[1].title + " @ " + item[2].title,
                icon: "iconTemplate",
                action: "runWithString",
                actionArgument: location
            };
        }
    });
}

function runWithString(address, compact) {
    init();
    LaunchBar.debugLog("Searching for "+address);

    try {
        var results = Lib.Cache.get(address, true);
        if (!results || LaunchBar.options.shiftKey) {
            var resp = API.request(address);
            var temp = Action.preferences.use_metric ? "C" : "F";

            results = [
                {
                    title: resp.main.temp + "°" + temp,
                    subtitle: "Temperature",
                    icon: "iconTemplate"
                },
                {
                    title: resp.main.temp_min + "°"+temp+" - " + resp.main.temp_max + "°"+temp,
                    subtitle: "Range",
                    icon: "CopyActionTemplate.pdf"
                },
                {
                    title: resp.main.humidity + "%",
                    subtitle: "Humidity",
                    icon: "CopyActionTemplate.pdf"
                }
            ];

            Lib.History.add(address);
            Lib.Cache.set(address, results, 600);
        }
    } catch (err) {
        Lib.Cache.clear(address);
        Lib.Notify.error(err);
        results = false;
    }

    return results;
}


function init() {
    if (Action.preferences.use_metric === undefined)
        Action.preferences.use_metric = true;

    if (Action.preferences.locations === undefined)
        Action.preferences.locations = [];
}
