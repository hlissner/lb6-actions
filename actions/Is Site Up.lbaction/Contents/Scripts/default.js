include("shared/lib.js");

var API_URL = 'http://www.isup.me/';

function run() {
    if (Action.preferences.sites === undefined)
        Action.preferences.sites = [];

    if (LaunchBar.options.controlKey || Action.preferences.sites.length === 0) {
        return [
            {
                title: "No sites set",
                subtitle: "Run this action to open the preferences plist",
                path: Action.supportPath + "/Preferences.plist"
            }
        ];
    }

    var items = [];
    Action.preferences.sites.forEach(function(site_url) {
        items.push(runWithString(site_url)[0]);
    });

    return items;
}

function runWithString(string) {
    try {
        var resp = HTTP.get(API_URL + string);
        LaunchBar.debugLog("URL="+API_URL+string);

        if (resp.error !== undefined)
            throw resp.error;
        if (resp.response.status !== 200)
            throw resp.response.localizedStatus;

        var html = resp.data;
        var url = URL.hostname(string);
        var m = html.match(/It's (not )?just you[!.]\s*<a href=".+" class="domain">(.+)<\/a>(<\/span>)? ((looks down from here)|(is up))./i);
        if (m === null) {
            return [{
                title: url,
                subtitle: "Huh? That doesn't look like a site on the interwho.",
                icon: "404"
            }];
        }

        History.add(url);

        var is_up = m[1] !== "not ";
        return [{
            title: url,
            url: url,
            subtitle: is_up ? "Site is up!" : "Site seems to be down.",
            icon: is_up ? "up" : "down"
        }];
    } catch (err) {
        Notify.error(err);
    }
}
