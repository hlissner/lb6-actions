var API_FILE = "~/.bitly";
var API_URL = "https://api-ssl.bitly.com";

function runWithString(url) {
    var api_key = getApiKey();
    var resp = HTTP.getJSON(API_URL + "/v3/expand?access_token="+api_key+"&shortUrl="+encodeURIComponent(url)).data;

    if (!resp instanceof Object || resp.status_code != 200) {
        LaunchBar.alert("Error "+resp.status_code+": "+resp.status_txt);
        return;
    }

    return [{
        title: resp.data.expand[0].long_url, 
        subtitle: resp.data.expand[0].short_url
    }];
}

// ----------------------
function getApiKey() {
    if (Action.preferences.api_key === undefined) {
        if (!File.exists(API_FILE)) {
            LaunchBar.alert("Bitly API file is missing. Create it here: ~/.bitly, with your access token in it.");
            return false;
        }
        Action.preferences.api_key = File.readText(API_FILE).trim();
    }
    return Action.preferences.api_key;
}
