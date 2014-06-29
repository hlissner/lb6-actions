var API_URL = "https://domai.nr/api/json/search?q=";

function run() {
    LaunchBar.openURL("https://domai.nr/");
}

function runWithString(string) {
    LaunchBar.openURL("https://domai.nr/"+encodeURIComponent(string));
}

