/*global Lib*/

include("shared/lib/url.js");

var API = {
    URL_PREFIX: "http://api.openweathermap.org/data/2.5/weather",

    key: function() {
        if (Action.preferences.api_key === undefined
            || Action.preferences.api_key === "")
            Action.preferences.api_key = "f7258996e617a44724c9ac72bb184d6d";
        return Action.preferences.api_key;
    },

    request: function(location) {
        var argv = {
            q: encodeURIComponent(location),
            units: Action.preferences.use_metric ? "metric" : "imperial",
            cnt: 7,
            mode: "json",
            APPID: this.key()
        };

        var uri = this.URL_PREFIX + Lib.URL.dict2qs(argv);
        LaunchBar.debugLog("API_CALL=" + uri);
        var resp = HTTP.getJSON(uri, {timeout: 5});
        if (resp.error != undefined || resp.response.status !== 200 || resp.data === undefined) {
            resp.error = (resp.error !== undefined ? resp.error : resp.response.status);
            LaunchBar.debugLog("ERROR="+resp.error);
            switch (resp.response.status) {
                case 401:
                    throw "Your API key was not accepted!";
                case 404:
                    throw "The API provider is down, please try again later.";
            }
            throw "There was an error with the API provider: " + resp.error;
        } else if (resp.data.cod !== 200) {
            throw "Error with the search terms (code: " + resp.data.message + "): " + resp.data.message;
        }

        return resp.data;
    }
};
