var Cache = {
    /**
     * Retrieves the cache entry, if it isn't stale.
     *
     * @param key string The id of the entry
     * @param bool has_ttl Whether the entry's ttl should be checked
     * @returns mixed/bool The entry value, or false if it has outlived its ttl
     */
    get: function(key, has_ttl) {
        has_ttl = has_ttl || false;
        if (Action.preferences._cache !== undefined && Action.preferences._cache[key] !== undefined) {
            var ts = Date.now();
            if (has_ttl && (ts - Action.preferences._cache_ts) > Action.preferences._cache_time)
                return false;

            LaunchBar.debugLog("Cache hit! For "+key);
            return Action.preferences._cache[key];
        }
        return false;
    },

    /**
     * Sets a time-limited cache entry.
     *
     * @param key string The id of the entry
     * @param value mixed The data to be saved
     * @param ttl int How long, in seconds, this entry stays fresh
     */
    set: function(key, value, ttl) {
        if (Action.preferences._cache === undefined)
            Action.preferences._cache = {};

        Action.preferences._cache[key] = value;
        if (ttl !== undefined) {
            Action.preferences._cache_time = ttl * 1000;
            Action.preferences._cache_ts = Date.now();
        }
    }
};
