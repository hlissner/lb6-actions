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
    try
    {
        // Only allow gifs
        var ext = image_path.split('.').pop().toLowerCase();
        if (["gif", "mov"].indexOf(ext) === -1)
            throw "Gfycat only accepts gifs and mov files";

        var mimetype = ext === "gif" ? "image/gif" : "video/quicktime";

        // Upload the file
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
            '-F', 'Content-Type=' + mimetype,
            '-F', 'file=@'+image_path,
            'https://gifaffe.s3.amazonaws.com/'
        );
        LaunchBar.debugLog("POST: key="+key+"&file=@"+image_path+"\nResponse: "+resp);
        if (resp.indexOf("HTTP/1.1 200 OK") == -1)
            throw "("+resp.error_reason+") "+resp.error_text;

        // Tell gfycat to transcode the gif, then return the gfyname
        resp = HTTP.getJSON("http://upload.gfycat.com/transcode/"+key);
        if (resp instanceof Object && resp.data.task === "complete")
            return resp.data.gfyname;
    } catch (err) {
        LaunchBar.displayNotification({title: "LaunchBar Error", string: err});
    }

    return [];
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
