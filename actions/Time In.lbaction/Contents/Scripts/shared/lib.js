/*
 * Included from ./shared/lib.js in root.
 *
 * Do not modify the copies of this file. Run "rake" in root to
 * propogate changes.
 */

/**
 * Display a dialog prompt asking for input.
 *
 * @param string question What to ask the user
 * @return string/bool The entered text. False if cancelled.
 */
function prompt(question) {
    var input = LaunchBar.executeAppleScript(
        'display dialog "'+question+'" default answer ""',
        'return text returned of result'
    ).trim();

    if (input.length === 0)
        return false;

    return input;
}


/**************************/

var Notify = {
    error: function(msg, data) {
        LaunchBar.displayNotification({title: "LaunchBar Error", string: msg.localize()});
        if (data)
            LaunchBar.debugLog("ERROR: DATA=" + (data instanceof Object ? JSON.stringify(data) : data));
    }
};


/**************************/

var Path = {
    scripts: Action.path + "/Contents/Scripts",

    basename: function(path) {
        return path.replace(/^.*[\\\/]/, '');
    },

    extension: function(path) {
        if (!path) return "";
        return path.split('.').pop();
    }
};


/**************************/

var Sanitize = {
    newlines: function(string) {
        return string.replace(/(\r\n|\n|\r)/gm,"").trim();
    },

    urlpath: function(string) {
        return encodeURIComponent(string).replace("%2F", "/");
    }
};


/**************************/

HTTP.post = function(url, args, ttl) {
    ttl = ttl || 5;
    if (!url) throw "HTTP.post: No URL provided";

    var argv = ['/usr/bin/curl', '-X', 'POST', '--connect-timeout', ttl];
    for (var key in args) {
        argv.push("-F");
        argv.push(key + "=" + args[key]);
    }
    argv.push(url);

    var resp = LaunchBar.execute.apply(argv).trim();
    if (!resp)
        throw "There was a problem with CURL";
    if (resp.error !== undefined)
        throw result.error;

    return resp;
};

HTTP.postJSON = function(url, args, ttl) {
    return JSON.stringify(HTTP.post(url, args, ttl));
};


/**************************/

var Cache = {
    /**
     * Path to the cache path.
     */
    PATH: Action.cachePath,

    /**
     * Retrieves the cache entry, if it isn't stale.
     *
     * @param key string The id of the entry
     * @param bool has_ttl Whether the entry's ttl should be checked
     * @returns mixed/bool The entry value, or false if it has outlived its ttl
     */
    get: function(key, has_ttl) {
        key = key.replace(/[^a-z0-9]/gi, '_').toLowerCase();

        var file_path = this.PATH + "/" + key + ".json";
        if (!File.exists(file_path))
            return false;

        has_ttl = has_ttl || false;
        var data = File.readJSON(file_path);

        var ts = Date.now();
        if ((has_ttl && (ts - data.ts) > data.ttl) || data.data === undefined) {
            LaunchBar.execute("rm", file_path);
            return false;
        }

        LaunchBar.debugLog("CACHE="+key);
        return data.data;
    },

    /**
     * Sets a time-limited cache entry.
     *
     * @param key string The id of the entry
     * @param value mixed The data to be saved
     * @param ttl int How long, in seconds, this entry stays fresh
     */
    set: function(key, value, ttl) {
        key = key.replace(/[^a-z0-9]/gi, '_').toLowerCase();

        var data = {data: value};
        if (ttl) {
            data.ts = Date.now();
            data.ttl = ttl * 1000;
        }

        File.writeJSON(data, this.PATH + "/" + key + ".json", {'prettyPrint' : false});
    }
};

var History = {
    MAX_ITEMS: 25,
    DEFAULT_ICON: null,

    add: function(location) {
        if (typeof location != 'string')
            return false;
        location = Sanitize.newlines(location);

        var list = this.get();
        if (list.indexOf(location) !== -1)
            return false;
        
        list.push(location);
        if (list.length > this.MAX_ITEMS) {
            list.shift();
        }

        Cache.set('history', list.reverse());
        return true;
    },

    get: function() {
        return Cache.get('history') || [];
    },

    list: function(icon) {
        return this.get().map(function(item) {
            return {title: item, icon: icon};
        });
    },

    suggestions: function(query, icon) {
        query = query.toLowerCase();

        var items = [];
        this.get().forEach(function(item) {
            if (query === "" || item.toLowerCase().indexOf(query) !== -1)
                items.push({title: item, icon: icon});
        });
        return items;
    }
};
