include("shared/request.js");
include("shared/cache.js");

var Data = {
    URL: "http://www.freecurrencyconverterapi.com/api/currencies", 

    FILE: Action.supportPath + "/currencies.json",

    get: function() {
        // We download the list of currencies once and forget about it.
        if (!File.exists(this.FILE) || LaunchBar.options.controlKey) {
            var data = Lib.Request.getJSON(this.URL).results;
            var results = Object.keys(data).map(function(currency) {
                return data[currency];
            });

            File.writeJSON(results, this.FILE, {prettyPrint: false});

            return results;
        } else {
            return File.readJSON(this.FILE);
        }
    }
};

var API = {
    URL: "http://www.freecurrencyconverterapi.com/api/convert",

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
        if (from.length != 3 || to.length != 3)
            throw "Currencies are not properly formatted! (" + from + " -> " + to + ")";

        // Normalize case, just in case
        from = from.toUpperCase();
        to = to.toUpperCase();

        var key = from + "-" + to;
        var rate = Lib.Cache.get(key, true);
        if (!rate || LaunchBar.options.controlKey){
            rate = parseFloat(Lib.Request.getJSON(this.URL, {q: key, compact: "y"})[key].val);

            // Freecurrencyconverterapi updates rates every 30 minutes, so we cache
            // them, and cache them both ways for posterity.
            Lib.Cache.set(key, rate, 1800);
            Lib.Cache.set(to + "-" + from, 1/rate, 1800);
        }

        return rate;
    }
};
