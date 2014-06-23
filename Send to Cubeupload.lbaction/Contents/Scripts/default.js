
var URL_PREFIX = 'http://i.cubeupload.com/';

function runWithString(string) {
    return runWithPaths([string]);
}

function runWithItem(item) {
    return runWithPaths([item.path]);
}

function runWithPaths(paths) {
    var items = [];
    for (var i in paths) {
        var resp = upload(paths[i]);
        if (resp !== false) {
            items.push({
                title: URL_PREFIX + resp.file_name,
                subtitle: basename(paths[i]),
                url: URL_PREFIX + resp.file_name
            });
        }
    }

    if (items.length === 0)
        return [{title: "Upload failed!"}];
    return items;
}

////////////////////////
function upload(image_path) {
    // Only allow images + pdfs
    var ext = image_path.split('.').pop();
    if (['jpg', 'png', 'jpeg', 'gif', 'bmp', 'pdf'].indexOf(ext) == -1) {
        LaunchBar.alert("Cubeupload only accept images. Received "+ext);
        return false;
    }

    var resp = LaunchBar.execute('/usr/bin/curl', 
            '-X', 'POST',
            '-F', 'name=' + basename(image_path),
            '-F', 'fileinput[0]=@' + image_path,
            'http://cubeupload.com/upload_json.php');

    if (resp !== "") {
        resp = JSON.parse(resp);
        if (resp.error === true) {
            LaunchBar.alert("Error "+resp.error_reason+": "+resp.error_text);
            return false;
        }

        return resp;
    }

    LaunchBar.alert("Error: Something went wrong!");
    return false;
}

function basename(path) {
    return path.replace(/^.*[\\\/]/, '');
}
