include('base64.js');

function runWithString(string) {
    try {
        var out = {
            html: htmldecode(string),
            url: decodeURIComponent(string),
            base64: Base64.decode(string),
            utf8: unescape(string)
        };

        return [
            {   title: out.html, 
                actionArgument: out.html, 
                subtitle: "HTML decoded",
                icon: "html" },
            {   title: out.url, 
                actionArgument: out.url, 
                subtitle: "URL decoded",
                icon: "url" },
            {   title: out.base64,
                actionArgument: out.base64,
                subtitle: "Base64 decoded",
                icon: "base64" },
            {   title: out.utf8,
                actionArgument: out.utf8,
                subtitle: "UTF-8 decoded",
                icon: "utf8" },
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
