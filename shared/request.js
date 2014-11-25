/*
 * Included from ./shared/request.js in root.
 *
 * Do not modify the copies of this file. Run "rake" in root to
 * propogate changes.
 */

include("shared/lib.js");
include("shared/url.js");

var Lib = Lib || {};

Lib.Request = {
    TMP_DIR: "/tmp",

    get: function(url, argv, ttl) {
        var _url = url + Lib.URL.dict2qs(argv);
        var resp = HTTP.get(_url, ttl || 5);

        LaunchBar.debugLog("URL: " + _url);
        LaunchBar.debugLog("RESP=" + JSON.stringify(resp));
        this._get_check(resp);

        return resp.data || "";
    },

    getJSON: function(url, argv, ttl) {
        var _url = url + Lib.URL.dict2qs(argv);
        var resp = HTTP.getJSON(_url, ttl || 5);

        LaunchBar.debugLog("URL: " + _url);
        LaunchBar.debugLog("RESP=" + JSON.stringify(resp));
        this._get_check(resp);

        return resp.data || [];
    },

    post: function(url, argv, ttl) {
        ttl = ttl || 5;
        if (!url) throw "Request.post: Improper URL provided";

        var tmpfile = this.TMP_DIR + "/" + Lib.genUID(5);

        var args = ['/usr/bin/curl', '-D', tmpfile, '-L', '-X', 'POST', '--connect-timeout', ttl.toString()];
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
        LaunchBar.debugLog("OUTPUT="+resp);
        if (resp === "")
            throw "Bad response from "+url;

        this._check_headers(tmpfile);

        return resp;
    },

    postJSON: function(url, argv, ttl) {
        return JSON.parse(this.post(url, argv, ttl));
    },

    _get_check: function(resp) {
        if (resp.error !== undefined)
            throw "There was an error with the request: " + resp.error;
        if (resp.response.status !== 200)
            throw "There was an error on the server (" + resp.response.status + "): " + resp.response.localizedStatus;
    },

    _check_headers: function(file) {
        var lines = File.readText(file).split("\n");
        if (lines.length === 0)
            return;

        var status, message;
        var headers = {};
        for (var i in lines) {
            var line = lines[i].trim();
            if (line.indexOf("HTTP/1") === 0) {
                var parts = line.split(" ");
                message = parts[2];
                status = parseInt(parts[1]);
                continue;
            }
            if (line.trim() === "" || line.indexOf(': ') === -1)
                continue;
            var items = line.split(": ");
            headers[items[0].trim()] = items[1].trim();
        }

        if (status !== 200)
            throw "There was an error on the server (" + status + "): " + message;
    },
};
