var API_URL = 'http://www.isup.me/';

function run() {
    if (Action.preferences.sites === undefined) {
        Action.preferences.sites = [];
    }

    if (LaunchBar.options.shiftKey || Action.preferences.sites.length === 0) {
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
        if (resp.error !== undefined)
            throw resp.error;
        if (resp.response.status !== 200)
            throw resp.response.localizedStatus;

        var html = resp.data;

        var url = get_hostname(string);
        var m = html.match(/It's (not )?just you[!.]\s*<a href=".+" class="domain">(.+)<\/a>(<\/span>)? ((looks down from here)|(is up))./i);
        if (m === null) {
            return [{
                title: url,
                subtitle: "Huh? That doesn't look like a site on the interwho.",
                icon: "404"
            }];
        }

        var is_up = m[1] !== "not ";
        return [{
            title: url,
            subtitle: is_up ? "Site is up!" : "Site seems to be down.",
            url: url,
            icon: is_up ? "up" : "down"
        }];
    } catch (err) {
        LaunchBar.displayNotification({title: "LaunchBar Error", string: err});
        LaunchBar.log("ERROR \nURL="+API_URL + string + "\nMSG=" + err);
    }
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
