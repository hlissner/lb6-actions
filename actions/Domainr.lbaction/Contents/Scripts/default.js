var API_URL = "https://domai.nr/api/json/search?q=";

function run() {
    LaunchBar.openURL("https://domai.nr/");
}

function runWithString(string) {
    LaunchBar.openURL(string.indexOf("http") === 0 ? string : "https://domai.nr/"+encodeURIComponent(string));
}

