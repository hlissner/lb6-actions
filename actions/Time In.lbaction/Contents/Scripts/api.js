include("shared/lib.js");
include("shared/request.js");
include("shared/cache.js");
include("shared/history.js");

var API = {
    URL_PREFIX: "https://maps.googleapis.com/maps/api",

    key: function() {
        if (Action.preferences.api_key === undefined)
            Action.preferences.api_key = "";
        return Action.preferences.api_key;
    },

    request: function(action, args) {
        var url = this.URL_PREFIX + "/" + action + "/json";

        var apikey = this.key();
        if (apikey)
            args.key = apikey;

        var resp = Lib.Request.getJSON(url, args);
        switch (resp.status) {
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

        var data = Lib.Cache.get(address.trim());
        if (LaunchBar.options.shiftKey || !data) {
            var resp = API.request('geocode', {address: encodeURIComponent(address)});
            data = {
                lat: resp.results[0].geometry.location.lat,
                lng: resp.results[0].geometry.location.lng
            };

            Lib.Cache.set(resp.results[0].formatted_address, data);
            Lib.History.add(resp.results[0].formatted_address);
        }

        return data;
    },

    tzdata: function(timestamp, lat, lng) {
        if (timestamp === undefined || lat === undefined || lng === undefined)
            throw "Missing parameters for API.tzdata";

        var tzkey = lat+","+lng;
        var tzdata = Lib.Cache.get(tzkey, true);
        var resp;
        if (LaunchBar.options.shiftKey || !tzdata) {
            resp = API.request('timezone', {location: lat+","+lng, timestamp: Math.floor(timestamp/1000)});
            if (resp.rawOffset === undefined || resp.dstOffset === undefined)
                throw "Could not find the timezone for that location";

            tzdata = {
                rawOffset: resp.rawOffset,
                dstOffset: resp.dstOffset,
                timezone:  resp.timeZoneName.split(" ").map(function(word) {
                    return word[0];
                }).join("")
            };
            Lib.Cache.set(tzkey, tzdata, 86400);
        }
        return tzdata;
    }
};
