include("shared/notify.js");
include("shared/url.js");

function run() {
    var data = get_tabs();
    if (!data) {
        Notify.error("Can't get Chrome's tabs. Is Chrome running?");
        return [];
    }

    return data;
}

function runWithItem(item) {
    var tabs = get_tab();
    for (var i = 0, len = tabs.length; i < len; i++) {
        if (tabs[i].url == item.url)
            return switch_tab(tabs[i]);
    }

    Notify.error("Can't find the selected tab.");
    return [];
}

///////////////////////////////
function switch_tab(tab) {
    LaunchBar.execute(
        "/usr/bin/osascript", 
        "switch_tab.applescript", 
        tab.win_id, tab.id, 
        LaunchBar.options.shiftKey ? 0 : 1
    );
}

function get_tabs() {
    // If shift is down, only list tabs in the foremost window
    only_local = LaunchBar.options.shiftKey;
    // If control key is down, switch the title with the url
    search_urls = LaunchBar.options.controlKey;

    try {
        var result = LaunchBar.execute(
            "/usr/bin/osascript", 
            "get_chrome_tabs.applescript", 
            only_local ? '1' : '0'
        );

        if (!result || result.trim() === "")
            return false;

        return result.split(",  !-% , ").map(function(line) {
            var tab = parse(line);

            var hostname = URL.hostname(tab.url);
            if (tab.title.length === 0 || tab.title === tab.url)
                tab.title = hostname;

            tab.subtitle = tab.url;
            tab.action = "switch_tab";
            tab.actionRunsInBackground = true;

            // Display dev sites and the newtab page with special icons
            tab.icon = "tab";
            if (hostname === 'localhost' || hostname.indexOf('.dev') === hostname.length - 4)
                tab.icon = "tab_dev";
            else if (tab.url === "chrome://newtab/")
                tab.icon = "tab_new";
            
            // Display more opaque icons for active tabs
            if (tab.is_active === '1')
                tab.icon = tab.icon + "_active";

            tab.icon += "Template";

            if (search_urls) {
                tab.subtitle = tab.title;
                tab.title = tab.url;
            }
            if (!only_local)
                tab.title = tab.win_id + ") " + tab.title;
            
            return tab;
        });
    } catch (err) {
        Notify.error(err);
    }
}

function parse(line) {
    var items = line.split(", ");
    if (items.length < 5) 
        return false;

    // If there happen to be commas in the tab title, this'll ensure
    // they're combined into a single title again.
    items[4] = items.splice(4).join(", ");

    return {
        id: items[0],
        win_id: items[1],
        is_active: items[2],
        url: items[3],
        title: items[4]
    };
}
