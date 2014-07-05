include("url.js");

var Request = {
    get: function(url, argv, ttl) {
        var resp = HTTP.get(url + "?" + URL.dict2qs(argv), ttl || 5);
        if (resp.error !== undefined)
            throw "Error: " + resp.error;
        if (resp.response.status !== 200)
            throw "Request Error: " + resp.response.localizedStatus;

        return resp.data;
    },

    getJSON: function(url, argv, ttl) {
        var data = this.get(url, argv, ttl);
        if (data === undefined)
            return [];
        
        return JSON.parse(data);
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

        var resp = LaunchBar.execute(argv);
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
        return this.post(url, argv, ttl);
    }
};
