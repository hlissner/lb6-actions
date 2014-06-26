var API_URL = "https://api-ssl.bitly.com";

function run() { getApiKey(); }

function runWithString(url) {
    var api_key = getApiKey();
    if (!api_key) return;

    var api_url = API_URL + "/v3/shorten?access_token="+api_key+"&longUrl="+encodeURL(url);
    var resp = HTTP.getJSON(api_url);

    try {
        if (resp.error !== undefined)
            throw "There was a problem querying the API. Response: "+resp.error;

        if (resp.data.status_code !== 200)
            throw "API error: " + resp.data.status_txt;

        LaunchBar.debugLog("Response: "+JSON.stringify(resp.data));

        return [{
            title: resp.data.data.url,
            subtitle: resp.data.data.long_url,
            url: resp.data.data.long_url
        }];
    } catch (err) {
        LaunchBar.displayNotification({
            title: "LaunchBar Error", 
            string: err
        });

    }
}

// ----------------------

function getApiKey() {
    if (Action.preferences.api_key === undefined || LaunchBar.options.shiftKey) {
        var input = LaunchBar.executeAppleScript('display dialog "Please enter your Bit.ly access token:" default answer ""', 'return text returned of result');

        if (input.trim().length === 0) {
            notify("You left the API string blank. Try again.");
            return false;
        }

        Action.preferences.api_key = input;
    }
    return Action.preferences.api_key.replace(/^\s+|\s+$/g, '');
}

function encodeURL(url) {
    if (url.indexOf('://') === -1)
        url = "http://" + url;

    return encodeURIComponent(url);
}

function notify(msg) {
    LaunchBar.displayNotification({title: "LaunchBar Error", string: msg});
}
