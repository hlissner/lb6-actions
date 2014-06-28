var URL = "http://hastebin.com/";

function runWithString(string) {
    var key = post(string);
    var url = URL + key;
    return [{
        'title': url,
        'subtitle': basename(string),
        'url': url
    }];
}

function runWithPaths(paths) {
    var items = [];
    var key;
    for (var i = paths.length - 1; i >= 0; i--){
        try {
            key = post(File.readText(paths[i]));
            items.push({
                'title': URL + key,
                'subtitle': basename(paths[i]),
                'url': URL + key
            });
        } catch (err) {
            LaunchBar.displayNotification({title: "LaunchBar Error", string: err});
        }
    }

    return items;
}

function post(string) {
    var resp = LaunchBar.execute(
        '/usr/bin/curl', 
        '-X', 'POST', 
        URL + 'documents', 
        '-d', string
    );
    if (!resp.trim())
        throw "No response from hastebin";

    resp = JSON.parse(resp);
    if (resp.key === undefined) 
        throw "Malformed response from hastebin";

    return resp.key;
}

function basename(path) {
    return path.replace(/^.*[\\\/]/, '');
}
