
/*
 * TODO: Cleaner error checking
 * TODO: Make sure the provide image(s) are actually gifs
 */

var URL_PREFIX = 'http://gfycat.com/';

function runWithPaths(paths) {
    var items = [];
    for (var i in paths) {
        var dest = upload(paths[i]);
        if (dest !== false) {
            items.push({
                title: URL_PREFIX + dest,
                subtitle: basename(paths[i]),
                url: URL_PREFIX + dest
            });
        }
    }

    return items;
}

function upload(image_path) {
    var key = makeKey();
    var resp = LaunchBar.execute(
        '/usr/bin/curl', '-i',
        '-X', 'POST',
        '-F', 'key='+key,
        '-F', 'acl=private',
        '-F', 'AWSAccessKeyId=AKIAIT4VU4B7G2LQYKZQ',
        '-F', 'policy=eyAiZXhwaXJhdGlvbiI6ICIyMDIwLTEyLTAxVDEyOjAwOjAwLjAwMFoiLAogICAgICAgICAgICAiY29uZGl0aW9ucyI6IFsKICAgICAgICAgICAgeyJidWNrZXQiOiAiZ2lmYWZmZSJ9LAogICAgICAgICAgICBbInN0YXJ0cy13aXRoIiwgIiRrZXkiLCAiIl0sCiAgICAgICAgICAgIHsiYWNsIjogInByaXZhdGUifSwKCSAgICB7InN1Y2Nlc3NfYWN0aW9uX3N0YXR1cyI6ICIyMDAifSwKICAgICAgICAgICAgWyJzdGFydHMtd2l0aCIsICIkQ29udGVudC1UeXBlIiwgIiJdLAogICAgICAgICAgICBbImNvbnRlbnQtbGVuZ3RoLXJhbmdlIiwgMCwgNTI0Mjg4MDAwXQogICAgICAgICAgICBdCiAgICAgICAgICB9',
        '-F', 'success_action_status=200',
        '-F', 'signature=mk9t/U/wRN4/uU01mXfeTe2Kcoc=',
        '-F', 'Content-Type=image/gif',
        '-F', 'file=@'+image_path,
        'https://gifaffe.s3.amazonaws.com/'
    );

    if (resp.indexOf("HTTP/1.1 200 OK") == -1) {
        LaunchBar.alert("Error "+resp.error_reason+": "+resp.error_text);
        return false;
    }
    
    resp = HTTP.getJSON("http://upload.gfycat.com/transcode/"+key);
    if (resp instanceof Object && resp.data.task !== undefined && resp.data.task == "complete") {
        return resp.data.gfyname;
    }

    LaunchBar.alert("Error: Something went wrong!");
    return false;
}

function basename(path) {
    return path.replace(/^.*[\\\/]/, '');
}

function makeKey() {
    var text = "";
    var mask = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += mask.charAt(Math.floor(Math.random() * mask.length));

    return text;
}
