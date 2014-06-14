
function runWithString(string) {
    var key = post2hastebin(string);
    // LaunchBar.openCommandURL("select?string=http://hastebin.com/"+key);

    var url = "http://hastebin.com/" + key;
    return [
        {
            'title': url,
            'url': url
        }
    ];
}

function runWithPaths(paths) {
    var url = "http://hastebin.com/";
    var ret = [];
    var key;
    for (var i = paths.length - 1; i >= 0; i--){
        if (key = post2hastebin(File.readText(paths[i]))) {
            ret.push({
                'title': url + key,
                'url': url + key
            });
        } else {
            ret.push({
                'title': "Could not be uploaded!",
                'subtitle': paths[i]
            });
        }
    }

    return ret;
}

function post2hastebin(string) {
    var resp = JSON.parse(LaunchBar.execute('/usr/bin/curl', '-XPOST', 'http://hastebin.com/documents', '-d', string));
    if (resp.key === undefined) {
        return false;
    }

    return resp.key;
}
