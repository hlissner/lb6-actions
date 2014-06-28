var API_URL = "https://maps.googleapis.com/maps/api";
var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

function run() {
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
    items.sort(function(a, b) {
         if (a.subtitle > b.subtitle) return 1;
         if (a.subtitle < b.subtitle) return -1;
         return 0;
    });

    return items;
}

function runWithString(address) {
    LaunchBar.debugLog("Searching for "+address);
    if (!address.trim()) return;

    try {
        var apikey = get_apikey();
        var resp;

        var data = is_cached(address.trim());
        if (!data) {
            resp = request(API_URL + "/geocode/json?key=" + apikey + "&address=" + encodeURIComponent(address));
            data = {
                lat: resp.data.results[0].geometry.location.lat,
                lng: resp.data.results[0].geometry.location.lng
            };

            cache(address, data);
        }

        var d = new Date();
        var ts = d.getTime();

        var tzkey = data.lat+","+data.lng;
        var tzdata = is_cached(tzkey, true);
        if (!tzdata) {
            resp = request(API_URL + "/timezone/json?key=" + apikey + "&location=" + data.lat + "," + data.lng + "&timestamp=" + Math.floor(ts/1000));
            
            tzdata = {rawOffset: resp.data.rawOffset, dstOffset: resp.data.dstOffset};
            cache(tzkey, tzdata, 60);
        }

        var ts2 = ts + ((tzdata.dstOffset + tzdata.rawOffset) * 1000) + (d.getTimezoneOffset() * 60000);
        var diff = (ts2 - ts) / (1000 * 60 * 60);

        // Formatting
        var diffline = diff !== 0
            ? Math.abs(diff) + " " + (diff > 0 ? "hr(s) ahead" : "hr(s) behind")
            : "Same timezone";

        var time = new Date(ts2);
        return [{
            title: ("0" + time.getHours()).slice(-2) + ":" + 
                ("0" + time.getMinutes()).slice(-2) + ":" + 
                ("0" + time.getSeconds()).slice(-2) + " ",
            subtitle: diffline,
            icon: "clock2"
        }];
    } catch (err) {
        var msg;
        if (err !== undefined && err instanceof Object) {
            msg = err.message;
            LaunchBar.log("Error: " + err.log);
            LaunchBar.log("Response: " + JSON.stringify(err.resp));
        } else {
            msg = err;
        }
        LaunchBar.displayNotification({title: "LaunchBar Error", string: msg});
    }
}

function runWithItem(item) {
    // recieve contact //
    LaunchBar.log(JSON.stringify(item));
}

/////////////////////

function is_cached(key, timeout_check) {
    timeout_check = timeout_check || false;
    if (Action.preferences._cache !== undefined && Action.preferences._cache[key] !== undefined) {
        var ts = new Date().getTime();
        if (timeout_check && (ts - Action.preferences._cache_ts) > Action.preferences._cache_time)
            return false;
        
        LaunchBar.debugLog("Cache hit! For "+key);
        return Action.preferences._cache[key];
    }
    return false;
}

function cache(key, data, timeout) {
    if (Action.preferences._cache === undefined)
        Action.preferences._cache = {};

    Action.preferences._cache[key] = data;
    if (timeout !== undefined) {
        Action.preferences._cache_time = timeout * 1000;
        Action.preferences._cache_ts = new Date().getTime();
    }
}

function request(url) {
    var resp = HTTP.getJSON(url);
    LaunchBar.debugLog("Requested: "+url);
    if (resp.error !== undefined)
        throw resp.error;
    switch (resp.data.status) {
        case "INVALID_REQUEST":
            throw {message: "The request was malformed. This is a bug!", log: resp.data.error_message, resp: resp};
        case "OVER_QUERY_LIMIT":
            throw {message: "You are over your API query limit. Try again later.", log: resp.data.error_message, resp: resp};
        case "REQUEST_DENIED":
            throw {message: "Your request was denied!", log: resp.data.error_message, resp: resp};
        case "UNKNOWN_ERROR":
            throw {message: "Something went wrong!", log: resp.data.error_message, resp: resp};
        case "ZERO_RESULTS":
            throw {message: "No timezone data could be found for the specified position or time.", log: resp.data.error_message, resp: resp};
    }

    return resp;
}

function get_apikey() {
    if (LaunchBar.options.alternateKey || Action.preferences.api_key === undefined)
        Action.preferences.api_key = prompt("Enter your Google API key:");
    return Action.preferences.api_key;
}

function prompt(question) {
    var input = LaunchBar.executeAppleScript(
        'display dialog "'+question+'" default answer ""',
        'return text returned of result'
    );
    input = input.trim();

    if (input.length === 0)
        throw "Dialog left blank";

    return input;
}
