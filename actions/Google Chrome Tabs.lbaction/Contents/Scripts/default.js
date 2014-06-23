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
        if (tab.url == item.url || tab.url == item) {
            return switch_tab(tab);
        }
    });

    LaunchBar.displayNotification({title: "LaunchBar Error", string: "Can't find the tab."});
    return [];
}

///////////////////////////////
function tab_select(tab) {
    if (LaunchBar.options.commandKey) {
        // Open new tab
    } else if (LaunchBar.options.shiftKey) {
        // Close tab
    }
}

function switch_tab(tab) {
    var result = LaunchBar.executeAppleScript(
        'tell application "Google Chrome"',
            'set (active tab index of (window '+tab.win_id+')) to '+tab.id,
            'activate (window '+tab.win_id+')',
            // 'set miniaturized of (window '+tab.win_id+') to false',
            'reopen (window '+tab.win_id+')',
        'end tell'
    );
}

function get_tabs() {
    var result = LaunchBar.executeAppleScript(
        'tell application "Google Chrome"',
            'set tabs_result to {}',
            'set win_id to 1',
            'repeat with the_window in every window # for every window',
                'set tab_list to every tab in the_window # get the tabs',
                'set tab_id to 1',
                'repeat with the_tab in tab_list # for every tab',
                    'set tab_url to the URL of the_tab',
                    'set tab_title to the title of the_tab',
                    'copy "{\\"id\\": " & tab_id & ", \\"win_id\\": " & win_id & ", \\"title\\":\\"" & tab_title & "\\", \\"url\\":\\"" & tab_url & "\\"}" to end of tabs_result',
                    'set tab_id to tab_id + 1',
                'end repeat',
                'set win_id to win_id + 1',
            'end repeat',
            'return tabs_result',
        'end tell'
    );

    var data = JSON.parse('[' + result + ']');
    if (data === undefined)
        return false;

    var favicon;
    data.forEach(function(tab) {
        // tab.title = tab.title;
        if (tab.title !== tab.url) {
            tab.subtitle = tab.url;
        }

        if (tab.title.trim().length === 0) {
            tab.title = get_hostname(tab.url);
        }

        favicon = get_favicon(tab.url);
        if (favicon !== false) {
            tab.icon = favicon.replace(/(\r\n|\n|\r)/,"");
        }

        tab.action = 'switch_tab';
    });

    LaunchBar.log(JSON.stringify(data));
    return data;
}

function get_favicon(url) {
    var spos = url.indexOf('//');
    if (spos === -1 || spos > 19) {
        return false;
    }

    var API_URL = "http://www.google.com/s2/favicons?domain=" + url;
    var hostname = get_hostname(url), 
        icon = false;

    if (Action.preferences.favicons === undefined) {
        Action.preferences.favicons = {};
    } else if (hostname in Action.preferences.favicons) {
        return Action.preferences.favicons[hostname];
    }

    var TMP_FILE = '/tmp/'+LaunchBar.bundleIdentifier;
    LaunchBar.execute('/usr/bin/curl', '-o', TMP_FILE, API_URL);
    if (File.exists(TMP_FILE)) {
        var data = LaunchBar.execute('/usr/bin/base64', TMP_FILE);
        icon = 'data:image/png;base64,' + data.trim();
        Action.preferences.favicons[hostname] = icon;
    }

    return icon.replace(/(\r\n|\n|\r)/,"");
}

function get_hostname(url) {
    var start = url.indexOf('//');
    var end =  url.indexOf('/', start+2);

    url = url.substr(start+2);

    if (end === -1)
        return url;
    return url.substr(0, end-(start+2));
}
