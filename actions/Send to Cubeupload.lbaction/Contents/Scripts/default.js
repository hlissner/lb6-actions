var URL_PREFIX = 'http://i.cubeupload.com/';

function runWithPaths(paths) {
    var items = [];
    for (var i in paths) {
        var resp = upload(paths[i]);
        if (resp !== false) {
            items.push({
                title: URL_PREFIX + resp.file_name,
                subtitle: basename(paths[i]),
                quickLookURL: "file://" + paths[i],
                url: URL_PREFIX + resp.file_name
            });
        }
    }

    if (!items.length) {
        return [];
    }

    return items;
}

function runWithItem(item) { return runWithPaths([item.path]); }


////////////////////////
function upload(image_path) {
    // Only allow images + pdfs
    try {
        var ext = image_path.split('.').pop().toLowerCase();
        if (['jpg', 'png', 'jpeg', 'gif', 'bmp', 'pdf'].indexOf(ext) == -1)
            throw "Cubeupload expected an image (jpg, png, gif, bmp, or pdf), but got a " + ext + " file.";

        var resp = LaunchBar.execute('/usr/bin/curl',
                '-X', 'POST',
                '-F', 'name=' + basename(image_path),
                '-F', 'fileinput[0]=@' + image_path,
                'http://cubeupload.com/upload_json.php');

        if (!resp.trim())
            throw "Received empty response from cubeupload.com.";

        resp = JSON.parse(resp);
        if (resp.error !== false)
            throw resp.error_reason + ": " + resp.error_text;

        return resp;
    } catch(err) {
        notify(err);
    }

    return false;
}

function basename(path) {
    return path.replace(/^.*[\\\/]/, '');
}

function notify(msg) {
    LaunchBar.displayNotification({title: "LaunchBar Error", string: msg});
}
