var API_URL = "https://domai.nr/api/json/search?q=";

function runWithString(string) {
    var data = api_call(string);
    var items = [];
    data.forEach(function(item) {
        items.push({
            title: item.domain,
            url: item.register_url,
            icon: item.availability,
            actionArgument: item.domain
        });
    });

    return items;
}

function api_call(term) {
    var resp = HTTP.getJSON(API_URL + encodeURIComponent(term));
    if (resp.error !== undefined)
        throw resp.error;
    if (resp.data.error !== undefined)
        throw resp.data.error.message;

    return resp.data.results;
}

