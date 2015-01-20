include("shared/lib.js");
include("shared/notify.js");
include("shared/request.js");
include("shared/url.js");

var API_URL = "https://api-ssl.bitly.com";

function runWithString(url) {
    var api_key = getApiKey();
    if (!api_key) return;

    try {
        var data = Lib.Request.getJSON(API_URL + "/v3/shorten", {
            access_token: api_key,
            longUrl: Lib.URL.fqn(url)
        });

        return [{
            title: data.data.url,
            subtitle: data.data.long_url,
            url: data.data.long_url
        }];
    } catch (err) {
        Lib.Notify.error(err);
    }
}

// ----------------------

function getApiKey() {
    if (Action.preferences.api_key === undefined || LaunchBar.options.controlKey) {
        var input = Lib.prompt('Please enter your Bit.ly access token');
        if (!input) {
            Lib.Notify.error("You left the API string blank. Try again.");
            return false;
        }

        Action.preferences.api_key = input;
    }
    return Action.preferences.api_key.trim_nl();
}
