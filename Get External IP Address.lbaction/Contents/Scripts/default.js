function run() {
    var resp = LaunchBar.execute('/usr/bin/curl', '-sf', 'http://checkip.dyndns.org');
    if (!resp) {
        LaunchBar.alert("Could not connect to checkip.dyndns.org.");
        return;
    }

    var result = resp.match(/\b(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\b/);
    if (result.length > 0) {
        LaunchBar.openCommandURL("select?string="+result[0]);
    } else {
        LaunchBar.alert("Checkip.dyndns.org responded with deformed output. Is this script out of date?");
        return;
    }
}
