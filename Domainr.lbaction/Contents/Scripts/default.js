include("shared/lib/request.js");
include("shared/lib/notify.js");
include("shared/lib/cache.js");

var API_URL = "https://api.domainr.com/v1/search";

function runWithString(string) {
    try {
        string = string.trim();
        if (string.length === 0)
            return;

        var data = Lib.Cache.get(string, true);
        if (!data) {
            data = api_call(string).map(function(item) {
                return {
                    title: item.domain,
                    url: item.register_url,
                    icon: item.availability
                };
            });
            Lib.Cache.set(string, data, 1800);
        }

        return data;
    } catch (err) {
        Lib.Notify.error(err);
    }
}

function api_call(term) {
    var resp = Lib.Request.getJSON(API_URL, {client_id: "lb6_action", q: encodeURIComponent(term)});
    if (resp.error !== undefined)
        throw "Domainr error ("+resp.error.status+"): "+resp.error.message;

    return resp.results;
}
