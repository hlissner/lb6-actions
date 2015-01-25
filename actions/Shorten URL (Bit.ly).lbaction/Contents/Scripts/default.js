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

        var title, subtitle, url;

        switch (data.status_txt) {
            case "ALREADY_A_BITLY_LINK":
                title = url;
                subtitle = "";
                break;
            case "INVALID_ARG_ACCESS_TOKEN":
                LaunchBar.log("API_KEY=" + api_key);
                throw "Your API key is invalid";
            case "RATE_LIMIT_EXCEEDED":
                throw "You've exceeded the limit on API requests, try again later";
            case "OK":
                title = data.data.url;
                subtitle = data.data.long_url;
                break;
            default:
                throw "An error occurred: " + data.status_txt;
        }

        url = title;

        Lib.copy(url);
        return [{
            title: title,
            subtitle: subtitle,
            url: url
        }];
    } catch (err) {
        if (data !== undefined)
            LaunchBar.log(JSON.stringify(data));
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
