include("shared/request.js");

var API = {
    URL_PREFIX: "http://api.openweathermap.org/data/2.5/forecast/daily",

    key: function() {
        if (Action.preferences.api_key === undefined)
            Action.preferences.api_key = "";
        return Action.preferences.api_key;
    },

    request: function(location) {
        var argv = {
            q: encodeURIComponent(location),
            units: Action.preferences.use_metric ? "metric" : "imperial",
            cnt: 7,
            mode: "json",
            lang: Action.preferences.lang,
            APPID: this.key()
        };

        var resp = Lib.Request.getJSON(this.URL_PREFIX, argv);
        if (resp.cod !== "200")
            throw "API Error ("+resp.cod+")";

        return resp;
    }
};
