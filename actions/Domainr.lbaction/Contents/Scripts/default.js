include("shared/request.js");
include("shared/notify.js");
include("shared/cache.js");

var API_URL = "https://domai.nr/api/json/search";

function runWithString(string) {
    try {
        if (LaunchBar.options.commandKey) {
            LaunchBar.openURL(
                "https://domai.nr/"+encodeURIComponent(string)
            );
        }

        string = string.trim();
        if (string.length === 0)
            return;

        var data = Cache.get(string, true);
        if (!data) {
            data = api_call(string).map(function(item) {
                return {
                    title: item.domain,
                    url: item.register_url,
                    icon: item.availability,
                    actionArgument: item.domain
                };
            });
            Cache.set(string, data, 20);
        }

        return data;
    } catch (err) {
        Notify.error(err);
    }
}

function api_call(term) {
    var resp = Request.getJSON(API_URL, {client_id: "lb6_action", q: encodeURIComponent(term)});
    if (resp.error !== undefined)
        throw "Domai.nr error ("+resp.error.status+"): "+resp.error.message;

    return resp.results;
}
