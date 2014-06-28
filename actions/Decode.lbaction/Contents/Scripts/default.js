include('base64.js');

function runWithString(string) {
    try {
        return [
            { title: htmldecode(string), subtitle: "HTML Decoded" },
            { title: decodeURIComponent(string), subtitle: "URL Decoded" },
            { title: Base64.decode(string), subtitle: "Base64 Decoded" },
            { title: unescape(string), subtitle: "UTF-8 Decoded" },
        ];
    } catch (err) {
        LaunchBar.displayNotification({title: "LaunchBar Error", string: err});
        return [];
    }
}

function htmldecode(string) {
    return LaunchBar.execute(
        "/usr/bin/php",
        Action.path + "/Contents/Scripts/html_decode.php", 
        string
    ).replace(/(\r\n|\n|\r)/gm,"").trim();
}
