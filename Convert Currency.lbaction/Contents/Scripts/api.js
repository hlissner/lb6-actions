include("shared/lib/request.js");
include("shared/lib/cache.js");

var Data = {
    PATH: Action.path + "/Contents/Resources/currencies.json",

    get: function() {
        return File.readJSON(this.PATH);
    }
};

var API = {
    URL: "http://apilayer.net/api/live",
    CACHE_TTL: 3600,

    /**
     * Returns a list of currencies whose currency name or ISO-4217 ID contains the
     * substring parameter.
     *
     * @param query string The string to search against
     * @returns array A list of matching currencies
     */
    suggest: function(query) {
        var data = Data.get();
        LaunchBar.debugLog("QUERY=" + query);
        if (query.trim() === "")
            return data;

        return data.filter(function(curr) {
            return (curr.currencyName.toLowerCase() + curr.id.toLowerCase()).indexOf(query) !== -1 || curr.id.indexOf(query) !== -1;
        });
    },

    /**
     * Queries freecurencyconverterapi.com for the rate and does the math!
     *
     * @param from string ISO-4217 currency code to convert from (e.g. DKK, USD, CAD)
     * @param to string ISO-4217 currency code to convert to (e.g. DKK, USD, CAD)
     * @returns int The exchange rate between from and to
     */
    get_rate: function(from, to) {
        if (from.length != 3 || to.length != 3) {
            throw "The currencies are not properly formatted. Here is an example: 24 "
                + "USD to EUR";
        }
        if (Action.preferences.api_key === undefined ||
            Action.preferences.api_key === "" ||
            Action.preferences.api_key === "---API KEY HERE---") {
                Action.preferences.api_key = "---API KEY HERE---";
                throw "You have not supplied a valid API Access Key. Please go into"
                    + " your preferences and set your api_key.\n\nAn api key can "
                    + "be acquired from https://currencylayer.com/ (it's free).";
        } else if (Action.preferences.api_key.match(/[^a-zA-Z0-9]/g)) {
            // filter out invalid characters from api key
            Action.preferences.api_key = Action.preferences.api_key.match(/[a-zA-Z0-9]+/g)[0];
        }

        // Normalize case, just in case
        from = from.toUpperCase();
        to   = to.toUpperCase();

        // Pull from cache, if available (check both ways)
        var key  = from + "-" + to;
        var data = Lib.Cache.get(key, true);
        if (!data) {
            data = Lib.Cache.get(to + "-" + from);
            if (typeof data === "object")
                data.rate = 1/data.rate;
        }

        // Request updated rates
        if (!data || typeof data !== "object" || LaunchBar.options.controlKey) {
            var req = Lib.Request.getJSON(
                this.URL,
                {access_key: Action.preferences.api_key, currencies: from + "," + to});
            if (req.success === false) {
                throw "API Error: " + req.error.info + ", key: " + Action.preferences.api_key;
            }

            data = {
                from: parseFloat(req.quotes["USD" + from]),
                to:   parseFloat(req.quotes["USD" + to])
            };
            data.rate = (1 / data.from) * data.to;

            // currencylayer (free) updates rates every hour, so we cache them
            Lib.Cache.set(key, data, 3600);
        }

        return data.rate;
    }
};
