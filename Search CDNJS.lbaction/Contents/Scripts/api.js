include("shared/lib.js");
include("shared/cache.js");
include("shared/notify.js");

var API = {
    URL: 'http://api.cdnjs.com/libraries',
    CACHE_KEY: "cdnjs_cache",

    /**
     * Get the full list of libraries in JSON from cdnjs. Cache for an hour.
     *
     * @return {Object} The full list of libraries in LB6 resultset format.
     */
    get: function() {
        var data;
        if ((data = Lib.Cache.get(this.CACHE_KEY, true)) === false) {
            data = HTTP.getJSON(this.URL, 5);
            if (data === undefined || data.error !== undefined) {
                throw "HTTP Error: " + data.error;
            }

            data = data.data.results.map(function(lib) {
                var filename = lib.latest.split("/").pop().replace(/[.-]min/, "");
                return {
                    "title": lib.name + " | " + filename,
                    "subtitle": lib.latest.replace('http://cdnjs.cloudflare.com/ajax/libs', ''),
                    "latest": lib.latest,
                    "action": DATA.select,
                    "icon": "iconTemplate"
                };
            });

            Lib.Cache.set(this.CACHE_KEY, data, 3600);
        }

        return data;
    }
};

var DATA = {
    /**
     * Return a list of libraries, filtered by query.
     *
     * @param {String} query The search query
     * @return {Object} The results in LB6 resultset format
     */
    suggestions: function(query) {
        query = query.toLowerCase();
        LaunchBar.debugLog("API is " + API.get());
        return API.get().filter(function(item) {
            return item.title.toLowerCase().indexOf(query) !== -1;
        });
    },

    /**
     * Return a library.
     *
     * @param {String} name The name of the library
     * @return {Object} The library details in LB6 resultset format
     */
    select: function(name) {
        var items = this.suggestions(name);
        if (items.length === 0) {
            return {"title": "No results found, try again.", "icon": "404"};
        }

        var item = items[0];
        var ext = item.latest.split(".").pop().toLowerCase();
        var html;
        switch (ext) {
            case "js":
                html = "<script type=\"text/javascript\" src=\"" + item.latest + "\"></script>";
                break;
            case "css":
                html = "<link rel=\"stylesheet\" type=\"text/css\" href=\"" + item.latest + "\" />";
                break;
        }

        return [
            {"title": item.title, "subtitle": item.subtitle, "icon": "iconTemplate"},
            {"title": item.latest, "url": item.latest},
            {"title": html, "icon": "htmlTemplate"}
        ];
    }
};
