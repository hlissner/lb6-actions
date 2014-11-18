include("shared/lib.js");
include("shared/path.js");
include("shared/notify.js");

var URL_PREFIX = 'http://gfycat.com/';

function runWithPaths(paths) {
    return paths.map(function(path) {
        var dest = upload(path);
        return dest !== false ? {
            "title": URL_PREFIX + dest,
            "subtitle": Lib.Path.basename(path),
            "url": URL_PREFIX + dest
        } : {
            "title": "Could not be uploaded.",
            "subtitle": Lib.Path.basename(path),
            "icon": "failure"
        };
    });
}

/**
 * Uploads the gif/mov file to Gfycat.
 *
 * @param {String} image_path the path to the gif/mov file
 */
function upload(image_path) {
    try {
        var ext = image_path.split('.').pop().toLowerCase();
        if (["gif", "mov"].indexOf(ext) === -1)
            throw "Gfycat only accepts gifs and mov files";

        var key = Lib.genUID();
        var resp = LaunchBar.execute(
            '/usr/bin/curl', '-i',
            '-X', 'POST',
            '-F', 'key=' + key,
            '-F', 'acl=private',
            '-F', 'AWSAccessKeyId=AKIAIT4VU4B7G2LQYKZQ',
            '-F', 'policy=eyAiZXhwaXJhdGlvbiI6ICIyMDIwLTEyLTAxVDEyOjAwOjAwLjAwMFoiLAogICAgICAgICAgICAiY29uZGl0aW9ucyI6IFsKICAgICAgICAgICAgeyJidWNrZXQiOiAiZ2lmYWZmZSJ9LAogICAgICAgICAgICBbInN0YXJ0cy13aXRoIiwgIiRrZXkiLCAiIl0sCiAgICAgICAgICAgIHsiYWNsIjogInByaXZhdGUifSwKCSAgICB7InN1Y2Nlc3NfYWN0aW9uX3N0YXR1cyI6ICIyMDAifSwKICAgICAgICAgICAgWyJzdGFydHMtd2l0aCIsICIkQ29udGVudC1UeXBlIiwgIiJdLAogICAgICAgICAgICBbImNvbnRlbnQtbGVuZ3RoLXJhbmdlIiwgMCwgNTI0Mjg4MDAwXQogICAgICAgICAgICBdCiAgICAgICAgICB9',
            '-F', 'success_action_status=200',
            '-F', 'signature=mk9t/U/wRN4/uU01mXfeTe2Kcoc=',
            '-F', 'Content-Type=' + (ext === "gif" ? "image/gif" : "video/quicktime"),
            '-F', 'file=@' + image_path,
            'https://gifaffe.s3.amazonaws.com/'
        );

        LaunchBar.debugLog("POST: key=" + key + "&file=@" + image_path + "\nResponse: " + resp);
        if (resp.indexOf("HTTP/1.1 200 OK") == -1)
            throw "(" + resp.error_reason + ") " + resp.error_text;

        // Gfycat first transcodes the file, then we've got to check
        // in again to see if it's done.
        resp = HTTP.getJSON("http://upload.gfycat.com/transcode/"+key);
        if (resp.data.task === "complete")
            return resp.data.gfyname;
    } catch (err) {
        Lib.Notify.error(err);
    }

    return false;
}
