include("shared/lib.js");
include("shared/url.js");
include("shared/history.js");
include("shared/request.js");
include("shared/notify.js");

var API_URL = 'http://www.isup.me/';

function run() {
    if (Action.preferences.sites === undefined)
        Action.preferences.sites = [];

    if (LaunchBar.options.controlKey || Action.preferences.sites.length === 0) {
        return {
            title: "No sites set",
            subtitle: "Run this action to open the preferences plist",
            path: Action.supportPath + "/Preferences.plist"
        };
    }

    return Action.preferences.sites.map(function(site_url) {
        return runWithString(site_url);
    });
}

function runWithString(string) {
    if (string.indexOf("\n") !== -1) {
        return string.split("\n").map(function(domain) {
            return runWithString(domain);
        });
    }

    try {
        var url = Lib.URL.hostname(string);
        var html;
        var is_up = false;
        try {
            html = Lib.Request.get(API_URL + url);

            var m = html.match(/It's (not )?just you[!.]\s*<a href=".+" class="domain">(.+)<\/a>(<\/span>)? ((looks down from here)|(is up))./i);
            if (m === null) {
                return {
                    title: url,
                    subtitle: "Huh? That doesn't look like a site on the interwho.",
                    icon: "404"
                };
            }

            is_up = m[1] !== "not ";
        } catch (err) {
            Lib.Notify.error(err);
        }

        Lib.History.add(url);

        return {
            title: url,
            url: url,
            subtitle: is_up ? "Site is up!" : "Site seems to be down.",
            icon: is_up ? "up" : "down"
        };
    } catch (err) {
        Lib.Notify.error(err);
    }
}
