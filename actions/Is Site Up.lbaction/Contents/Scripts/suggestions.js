include("shared/history.js");
include("shared/url.js");

function runWithString(address) {
    return Lib.History.suggestions(address).map(function(url) {
        return {
            title: Lib.URL.hostname(url),
            url: Lib.URL.fqn(url)
        };
    });
}
