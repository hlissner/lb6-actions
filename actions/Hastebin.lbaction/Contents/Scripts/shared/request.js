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
        if (!resp)
            throw "Bad response from "+url;

        var lines = resp.split("\n");
        var matches = lines[0].match(/HTTP.+(\d{3}) ([^\n\r]+)/);
        var status = parseInt(matches[1]);
        if (status !== 200)
            throw "Error ("+matches[1]+"): "+matches[2];

        return lines.splice(lines.indexOf("")).join("\n");
    },

    postJSON: function(url, argv, ttl) {
        return JSON.parse(this.post(url, argv, ttl));
    },

    _get_check: function(resp) {
        if (resp.error !== undefined)
            throw "Request Error: " + resp.error;
        if (resp.response.status !== 200)
            throw "Request Error: " + resp.response.localizedStatus;
    }
};
