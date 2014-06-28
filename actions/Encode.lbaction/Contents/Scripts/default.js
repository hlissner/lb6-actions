include('base64.js');

function runWithString(string) {
    try {
        return [
            { title: htmlencode(string), subtitle: "HTML Encoded" },
            { title: encodeURIComponent(string), subtitle: "URL Encoded" },
            { title: Base64.encode(string), subtitle: "Base64 Encoded" },
            { title: escape(string), subtitle: "UTF-8 Encoded" },
        ];
    } catch (err) {
        LaunchBar.displayNotification({title: "LaunchBar Error", string: err});
        return [];
    }
}

function htmlencode(string) {
    return LaunchBar.execute(
        "/usr/bin/php",
        Action.path + "/Contents/Scripts/html_encode.php", 
        string
    ).replace(/(\r\n|\n|\r)/gm,"").trim();
}
