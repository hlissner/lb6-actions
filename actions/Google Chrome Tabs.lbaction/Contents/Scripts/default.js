function run() {
    var data = get_tabs();
    if (data === false) {
        LaunchBar.displayNotification({
            title: "LaunchBar Error", 
            string: "Can't get Chrome's tabs. Is Chrome running?"
        });
        return [];
    }

    return data;
}

function runWithString(string) {
    return run();
}

function runWithItem(item) {
    var tabs = get_tab();
    for (var i = 0, len = tabs.length; i < len; i++) {
        if (tabs[i].url == item.url)
            return switch_tab(tabs[i]);
    }

    LaunchBar.displayNotification({title: "LaunchBar Error", string: "Can't find the tab."});
    return [];
}

///////////////////////////////
function switch_tab(tab) {
    LaunchBar.execute("/usr/bin/osascript", "switch_tab.scpt", tab.win_id, tab.id);
}

function get_tabs() {
    only_local = LaunchBar.options.shiftKey;
    // search_urls = LaunchBar.options.alternateKey;

    var result = LaunchBar.execute("/usr/bin/osascript", "get_chrome_tabs.scpt", only_local ? '1' : '0');
    if (result === undefined)
        return false;

    var data = [];
    var items = [];
    var hostname;

    try {
        result_list = result.split("\n");
        for (var i = 0, len = result_list.length; i < len; i++) {
            items = result_list[i].split("\t");
            if (result_list[i].length === 0 || items.length != 4)
                continue;

            var tab = {
                id: items[0],
                win_id: items[1],
                title: items[2],
                url: items[3]
            };

            hostname = get_hostname(tab.url);
            
            if (tab.title.length === 0 || tab.title === tab.url)
                tab.title = hostname;

            tab.subtitle = tab.url;
            // if (search_urls) {
            //     tab.subtitle = tab.title;
            //     tab.title = tab.url;
            // }

            tab.action = "switch_tab";
            
            // If you want favicon functionality, uncomment this
            // item.icon = get_favicon(item.url);
            
            tab.icon = "tab";
            // Display dev sites with a special icon
            if (hostname === 'localhost' || hostname.indexOf('.dev') === hostname.length - 4)
                tab.icon = "tab-dev";
            else if (tab.url === "chrome://newtab/")
                tab.icon = "tab-new";

            data.push(tab);
        }
    } catch (err) {
        LaunchBar.displayNotification({title: "LaunchBar Error", string: err});
        LaunchBar.log(result);
        return null;
    }

    return data;
}

function get_hostname(url) {
    var start = url.indexOf('//');
    if (start !== -1) 
        start += 2;
    else
        start = 0;

    var end =  url.indexOf('/', start);
    if (end === -1) return url.substr(start);

    return url.substr(start, end-start);
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
//         icon = null;
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
