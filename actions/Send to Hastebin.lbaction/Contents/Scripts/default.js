
function runWithString(string) {
    var key = post(string);
    var url = "http://hastebin.com/" + key;
    return [{
        'title': url,
        'subtitle': basename(string),
        'url': url
    }];
}

function runWithPaths(paths) {
    var url = "http://hastebin.com/";
    var ret = [];
    var key;
    for (var i = paths.length - 1; i >= 0; i--){
        key = post(File.readText(paths[i]));
        if (key !== false) {
            ret.push({
                'title': url + key,
                'subtitle': basename(paths[i]),
                'url': url + key
            });
        }
    }

    return ret;
}

function post(string) {
    var resp = JSON.parse(LaunchBar.execute(
        '/usr/bin/curl', 
        '-X', 'POST', 
        'http://hastebin.com/documents', 
        '-d', string)
    );
    if (resp.key === undefined)
        return false;

    return resp.key;
}

function basename(path) {
    return path.replace(/^.*[\\\/]/, '');
}
