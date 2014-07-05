include("shared/lib.js");

var API = {
    URL_PREFIX: "https://maps.googleapis.com/maps/api",

    key: function() {
        if (Action.preferences.api_key === undefined)
            Action.preferences.api_key = "";
        return Action.preferences.api_key;
    },

    request: function(action, args) {
        var url = this.URL_PREFIX + "/" + action + "/json?";
        var argv = [];
        var apikey = this.key();
        if (apikey)
            args.key = apikey;
        for (var key in args)
            argv.push(key + "=" + args[key]);

        var resp = HTTP.getJSON(url + argv.join('&'));
        LaunchBar.debugLog("Requested: "+url);
        if (resp.error !== undefined)
            throw "ERROR: " + resp.error;

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
        if (LaunchBar.options.shiftKey || !data) {
            var resp = API.request('geocode', {address: encodeURIComponent(address)});
            data = {
                lat: resp.data.results[0].geometry.location.lat,
                lng: resp.data.results[0].geometry.location.lng
            };

            Cache.set(resp.data.results[0].formatted_address, data);
            History.add(resp.data.results[0].formatted_address);
        }

        return data;
    },

    tzdata: function(timestamp, lat, lng) {
        if (timestamp === undefined || lat === undefined || lng === undefined)
            throw "Missing parameters for API.tzdata";

        var tzkey = lat+","+lng;
        var tzdata = Cache.get(tzkey, true);
        if (LaunchBar.options.shiftKey || !tzdata) {
            resp = API.request('timezone', {location: lat+","+lng, timestamp: Math.floor(timestamp/1000)});
            
            tzdata = {rawOffset: resp.data.rawOffset, dstOffset: resp.data.dstOffset};
            Cache.set(tzkey, tzdata, 86400);
        }
        return tzdata;
    }
};
