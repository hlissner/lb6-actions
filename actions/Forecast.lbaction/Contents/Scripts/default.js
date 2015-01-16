include("shared/notify.js");
include("shared/cache.js");
include("shared/history.js");
include("api.js");

var Days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function run() {
    init();
    var path = Action.supportPath + "/Preferences.plist";
    if (LaunchBar.options.controlKey) {
        API.key();
        return [{title: "Preferences", path: path}];
    }

    if (Action.preferences.location === "" || Action.preferences.location === undefined) {
        Action.preferences.location = "";
        return [
            {title: "No default location is set"},
            {title: "Preferences", path: path}
        ];
    }

    return runWithString(Action.preferences.location);
}

function runWithString(address) {
    init();
    LaunchBar.debugLog("Searching for "+address);

    try {
        var results = Lib.Cache.get(address, true);
        if (!results || LaunchBar.options.shiftKey) {
            var resp = API.request(address);
            var today = new Date().getDay();
            results = resp.list.map(function(day) {
                var d = new Date(day.dt*1000);
                var day_i = d.getDay();
                var day_name = today === day_i ? "Today" : Days[day_i];
                var units = Action.preferences.use_metric ? 'C' : 'F';

                return {
                    title: day_name + ": " + day.weather[0].description,
                    subtitle: day.temp.min + "°" + units + " - " + day.temp.max + "°" + units + " | Humidity: " + day.humidity.toString() + "%",
                    icon: day.weather[0].icon + "Template"
                };
            });

            Lib.History.add(address);
            Lib.Cache.set(address, results, 3600);
        }

        return results;
    } catch (err) {
        Lib.Notify.error(err);
    }
}


function init() {
    if (Action.preferences.use_metric === undefined)
        Action.preferences.use_metric = true;
    
    if (Action.preferences.lang === undefined)
        Action.preferences.lang = "en";
}
