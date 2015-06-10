include("shared/request.js");
include("shared/cache.js");

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
            throw "Currencies are not properly formatted. Here is an example: 24 "
            + "USD to EUR";
        }
        if (Action.preferences.api_key === undefined ||
            Action.preferences.api_key === "" ||
            Action.preferences.api_key === "---API KEY HERE---") {
                Action.preferences.api_key = "---API KEY HERE---";
                throw "You have not supplied a valid API Access Key. Please go into"
                    + " your preferences and add an api_key field.\n\nAn api key can "
                    + "be acquired from https://currencylayer.com/ (it's free).";
        }
        // if (Action.preferences.api_key === null || Action.preferences.api_key === "") {
        //     Action.preferences.api_key = "";
        //     throw "You have not supplied a valid API Access Key. Please go into"
        //         + " your preferences and add an api_key field.\n\nAn api key can "
        //         + "be acquired from https://currencylayer.com/ (it's free).";
        // }

        // Normalize case, just in case
        from = from.toUpperCase();
        to = to.toUpperCase();

        var key = from + "-" + to;
        var rate = Lib.Cache.get(key, true);
        if (!rate || LaunchBar.options.controlKey){
            var data = Lib.Request.getJSON(
                this.URL,
                {access_key: Action.preferences.api_key, currencies: from + "," + to});
            if (data.success === false) {
                throw "API Error: " + data.error.info + ", key: " + Action.preferences.api_key;
            }
            from_rate = parseFloat(data.quotes["USD" + from]);
            to_rate = parseFloat(data.quotes["USD" + to]);
            rate = ((1 / from_rate) * to_rate);

            // currencylayer (free) updates rates every hour, so we cache them,
            // and cache them both ways for posterity.
            Lib.Cache.set(key, rate, 3600);
            Lib.Cache.set(to + "-" + from, 1/rate, 3600);
        }

        return rate;
    }
};
