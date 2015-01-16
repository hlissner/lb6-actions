include("shared/history.js");
include("shared/notify.js");
include("shared/path.js");
include("shared/request.js");

var API_URL = "http://hastebin.com";

Lib.History.MAX_ITEMS = 50;

function run() {
    try {
        var history = Lib.History.get();
        if (history.length === 0)
            return [{title: "No hastebins in history"}];

        return history.map(function(item) {
            return {
                title: item[0],
                url: item[0],
                subtitle: item[1]
            };
        });
    } catch (err) {
        Lib.Notify.error(err);
    }
}

function runWithString(string) {
    try {
        var url = API_URL + "/" + post(string);
        Lib.History.add([url, string]);
        return [{title: url, subtitle: string, url: url}];
    } catch (err) {
        Lib.Notify.error(err);
    }
}

function runWithPaths(paths) {
    return paths.map(function(path) {
        try {
            if (!File.isReadable(path))
                throw "File isn't readable: "+path;

            var text = File.readText(path);
            var key = post(text);

            Lib.History.add([url, text.substr(0, 30)]);
            return {
                title: API_URL + "/" + key,
                subtitle: Lib.Path.basename(path),
                url: API_URL + "/" + key
            };
        } catch (err) {
            Lib.Notify.error(err);
        }
    });
}

function post(string) {
    var resp = Lib.Request.postJSON(API_URL+"/documents", {"-d": string});
    if (resp.key === undefined) 
        throw "Malformed response from hastebin";

    return resp.key;
}
