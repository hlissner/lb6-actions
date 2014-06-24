function run() {
    var data = get_tabs();
    if (data === undefined) {
        LaunchBar.displayNotification({title: "LaunchBar Error", string: "Can't get Chrome's tabs. Is Chrome running?"});
        return [];
    }

    return data;
}

function runWithString(string) {
    run();
}

function runWithItem(item) {
    var data = get_tabs();
    data.forEach(function(tab) {
        if (tab.url == item.url)
            switch_tab(tab);
    });

    LaunchBar.displayNotification({title: "LaunchBar Error", string: "Can't find the tab."});
    return [];
}

///////////////////////////////
function switch_tab(tab) {
    LaunchBar.executeAppleScript(
        'tell application "Google Chrome" to set (active tab index of (window '+tab.win_id+')) to '+tab.id
    );
}

function get_tabs() {
    var result = LaunchBar.execute("/usr/bin/osascript", "get_chrome_tabs.scpt");
    if (result === undefined)
        return false;

    var data = JSON.parse('[' + result + ']');
    if (data === undefined)
        return false;

    var favicon;
    data.forEach(function(tab) {
        var hostname = get_hostname(tab.url);
        if (tab.title !== tab.url)
            tab.subtitle = tab.url;

        if (tab.title.length === 0)
            tab.title = get_hostname(tab.url);

        // favicon = get_favicon(tab.url);
        // if (favicon !== false)
        //     tab.icon = favicon.substr(0, favicon.length);

        tab.action = 'switch_tab';
    });

    // LaunchBar.log(JSON.stringify(data));
    return data;
}

function get_hostname(url) {
    var start = url.indexOf('//');
    var end =  url.indexOf('/', start+2);

    url = url.substr(start+2);

    if (end === -1)
        return url;
    return url.substr(0, end-(start+2));
}

// This gets the favicon of the tab and converts it to a Data URI. Google's 
// service only returns the 16x16 favicons (can't look for a bigger one) -- 
// which isn't worth the cost in performance.
//
// Feel free to enable it if you'd like the functionality though. It still works.
//
// function get_favicon(url) {
//     var spos = url.indexOf('//');
//     if (spos === -1 || spos > 19) return false;
//
//     var hostname = get_hostname(url), 
//         icon = false;
//
//     if (Action.preferences.favicons === undefined) {
//         Action.preferences.favicons = {};
//     } else if (hostname in Action.preferences.favicons) {
//         return Action.preferences.favicons[hostname];
//     }
//
//     var API_URL = "http://www.google.com/s2/favicons?domain=" + url;
//     var TMP_FILE = '/tmp/'+LaunchBar.bundleIdentifier;
//     LaunchBar.execute('/usr/bin/curl', '-o', TMP_FILE, API_URL);
//     if (File.exists(TMP_FILE)) {
//         var data = LaunchBar.execute('/usr/bin/base64', TMP_FILE);
//         icon = 'data:image/png;base64,' + data.trim();
//         Action.preferences.favicons[hostname] = icon;
//     }
//
//     return icon.replace(/(\r\n|\n|\r)/,"");
// }
