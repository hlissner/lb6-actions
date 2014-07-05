include("shared/request.js");
include("shared/notify.js");

var API_URL = "https://domai.nr/api/json/search";

function runWithString(string) {
    try {
        return api_call(string).map(function(item) {
            return {
                title: item.domain,
                url: item.register_url,
                icon: item.availability,
                actionArgument: item.domain
            };
        });
    } catch (err) {
        Notify.error(err);
    }
}

function api_call(term) {
    var resp = Request.getJSON(API_URL, {q: encodeURIComponent(term)});
    if (resp.error !== undefined)
        throw "Domai.nr ("+resp.error.status+"): "+resp.error.message;

    return resp.results;
}

