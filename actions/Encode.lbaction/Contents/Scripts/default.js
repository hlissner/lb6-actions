// TODO: Add history

include('shared/lib.js');
include('shared/notify.js');
include('shared/base64.js');

function runWithString(string) {
    try {
        var out = {
            html: htmlencode(string),
            url: encodeURIComponent(string),
            base64: Base64.encode(string),
            utf8: escape(string)
        };

        return [
            {   title: out.html, 
                actionArgument: out.html, 
                subtitle: "HTML encoded",
                icon: "html" },
            {   title: out.url, 
                actionArgument: out.url, 
                subtitle: "URL encoded",
                icon: "url" },
            {   title: out.base64,
                actionArgument: out.base64,
                subtitle: "Base64 encoded",
                icon: "base64" },
            {   title: out.utf8,
                actionArgument: out.utf8,
                subtitle: "UTF-8 encoded",
                icon: "utf8" },
        ];
    } catch (err) {
        Notify.error(err);
    }
}

function htmlencode(string) {
    return LaunchBar.execute(
        "/usr/bin/php",
        Action.path + "/Contents/Scripts/html_encode.php", 
        string
    ).trim_nl();
}
