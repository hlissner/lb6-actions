include("cache.js");

var API_URL_PREFIX = "https://maps.googleapis.com/maps/api";
var API = {
    key: function() {
        if (Action.preferences.api_key === undefined)
            Action.preferences.api_key = prompt("Enter your Google API key:");
        return Action.preferences.api_key;
    },

    request: function(url) {
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
    },

    coordinates: function(address) {
        if (address === undefined)
            throw "Missing parameters for API.coordinates";

        var data = Cache.get(address.trim());
        if (!data) {
            var resp = API.request(API_URL_PREFIX + "/geocode/json" + 
                "?key=" + this.key() + 
                "&address=" + encodeURIComponent(address)
            );
            data = {
                lat: resp.data.results[0].geometry.location.lat,
                lng: resp.data.results[0].geometry.location.lng
            };

            Cache.set(resp.data.results[0].formatted_address, data);
        }

        return data;
    },

    tzdata: function(timestamp, lat, lng) {
        if (timestamp === undefined || lat === undefined || lng === undefined)
            throw "Missing parameters for API.tzdata";

        var tzkey = lat+","+lng;
        var tzdata = Cache.get(tzkey, true);
        if (!tzdata) {
            resp = API.request(API_URL_PREFIX + "/timezone/json" + 
                "?key=" + this.key() + 
                "&location=" + lat + "," + lng + 
                "&timestamp=" + Math.floor(timestamp/1000)
            );
            
            tzdata = {rawOffset: resp.data.rawOffset, dstOffset: resp.data.dstOffset};
            Cache.set(tzkey, tzdata, 60);
        }
        return tzdata;
    }
};

function prompt(question) {
    var input = LaunchBar.executeAppleScript(
        'display dialog "'+question+'" default answer ""',
        'return text returned of result'
    ).trim();

    if (input.length === 0)
        throw "Dialog left blank";

    return input;
}
