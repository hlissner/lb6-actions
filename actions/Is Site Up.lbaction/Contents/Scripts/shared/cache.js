/*
 * Included from ./shared/cache.js in root.
 *
 * Do not modify the copies of this file. Run "rake" in root to
 * propogate changes.
 */

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
        if (Action.debugLogEnabled)
            return false;

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
