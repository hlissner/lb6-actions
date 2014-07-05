include("shared/history.js");
include("shared/url.js");

function runWithString(address) {
    return History.suggestions(address).map(function(url) {
        return {
            title: URL.hostname(url),
            url: URL.fqn(url)
        };
    });
}
