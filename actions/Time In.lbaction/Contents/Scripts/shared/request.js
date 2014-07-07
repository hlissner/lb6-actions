/*
 * Included from ./shared/request.js in root.
 *
 * Do not modify the copies of this file. Run "rake" in root to
 * propogate changes.
 */

include("shared/url.js");

var Request = {
    get: function(url, argv, ttl) {
        var _url = url + "?" + URL.dict2qs(argv);
        var resp = HTTP.get(_url, ttl || 5);
        
        LaunchBar.debugLog("URL="+_url);
        this._get_check(resp);
        LaunchBar.debugLog("RESP="+JSON.stringify(resp));

        return resp.data || "";
    },

    getJSON: function(url, argv, ttl) {
        var _url = url + "?" + URL.dict2qs(argv);
        var resp = HTTP.getJSON(_url, ttl || 5);

        LaunchBar.debugLog("URL="+_url);
        this._get_check(resp);
        LaunchBar.debugLog("RESP="+JSON.stringify(resp));

        return resp.data || [];
    },

    post: function(url, argv, ttl) {
        ttl = ttl || 5;
        if (!url) throw "Request.post: Improper URL provided";

        var args = ['/usr/bin/curl', '-i', '-X', 'POST', '--connect-timeout', ttl.toString()];
        for (var key in argv) {
            if (key[0] === "-") {
                args.push(key);
                args.push(argv[key]);
            } else {
                args.push("-F");
                args.push(key + "=" + argv[key]);
            }
        }
        args.push(url);

        var resp = LaunchBar.execute(args);
        if (resp.trim() === "")
            throw "Bad response from "+url;

        var lines = resp.split("\n");
        var stat = lines.filter(function(line) {
            // Some curl requests get one HTTP status before receiving the HTTP
            // 200 OK. This makes sure to gloss over any number of statuses until the
            // 200, if it exists.
            return line.indexOf("HTTP/1.") === 0 && line.indexOf("200 OK") !== -1;
        });

        if (stat.length === 0)
            throw "Failed request to "+url;

        return lines.splice(lines.indexOf("")).join("\n");
    },

    postJSON: function(url, argv, ttl) {
        return JSON.parse(this.post(url, argv, ttl));
    },

    _get_check: function(resp) {
        if (resp.error !== undefined)
            throw "Request Error: " + resp.error;
        if (resp.response.status !== 200)
            throw "Response Error: " + resp.response.localizedStatus;
        if (resp.data === undefined)
            throw "Request received no data";
    }
};
