function run() {
    var resp = LaunchBar.execute('/usr/bin/curl', '-sf', 'http://checkip.dyndns.org');
    if (resp.trim() !== "") {
        var result = resp.match(/\b(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\b/);

        if (result.length === 0) {
            LaunchBar.alert("Checkip.dyndns.org responded with deformed output.");
            return;
        }

        return [{
            title: result[0],
            subtitle: 'External IP Address'
        }];
    }
}
