var BITLY_API = "~/.bitly";
var API_URL = "https://api-ssl.bitly.com";

function runWithString(url) {
    var api_key = getApiKey();
    var resp = HTTP.getJSON(API_URL + "/v3/shorten?access_token="+api_key+"&longUrl="+encodeURIComponent(url)).data;

    if ((!resp || resp.status_code === undefined) || resp.status_code != 200) {
        LaunchBar.alert("Error "+resp.status_code+": "+resp.status_txt);
        LaunchBar.alert(JSON.stringify(resp));
        return;
    }

    return [
        {title: resp.data.url, subtitle: resp.data.long_url}
    ];
}

// ----------------------

function getApiKey() {
    if (!File.exists(BITLY_API)) {
        LaunchBar.alert("Bitly API file is missing. Create it here: ~/.bitly, with your access token in it.");
        return false;
    }
    return File.readText(BITLY_API).trim();
}
