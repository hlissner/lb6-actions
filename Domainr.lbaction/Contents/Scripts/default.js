include("shared/request.js");
include("shared/notify.js");
include("shared/cache.js");

var API_URL = "https://api.domainr.com/v1/search";

function runWithString(string) {
    try {
        if (LaunchBar.options.commandKey) {
            LaunchBar.openURL(
                "https://domainr.com/"+encodeURIComponent(string)
            );
        }

        string = string.trim();
        if (string.length === 0)
            return;

        var data = Lib.Cache.get(string, true);
        if (!data) {
            data = api_call(string).map(function(item) {
                return {
                    title: item.domain,
                    url: item.register_url,
                    icon: item.availability,
                    actionArgument: item.domain
                };
            });
            Lib.Cache.set(string, data, 20);
        }

        return data;
    } catch (err) {
        Lib.Notify.error(err);
    }
}

function api_call(term) {
    var resp = Lib.Request.getJSON(API_URL, {client_id: "{your-mashape-key}", q: encodeURIComponent(term)});
    if (resp.error !== undefined)
        throw "Domainr error ("+resp.error.status+"): "+resp.error.message;

    return resp.results;
}
