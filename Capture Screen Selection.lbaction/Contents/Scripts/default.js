function run() {
    var uid = genUID();
    var path = '/tmp/' + uid + '.png';

    try {
        LaunchBar.execute('/usr/sbin/screencapture', '-i', path);
        if (!File.exists(path)) {
            throw "File doesn't exist!";
        }
    } catch (err) {
        LaunchBar.alert("Error taking the screenshot.");
        return;
    }

    LaunchBar.openCommandURL('select?file='+encodeURIComponent(path));

    return [
        { title: uid + '.png', path: path, actionArgument: path }
    ];
}

function genUID() {
    var text = "";
    var mask = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += mask.charAt(Math.floor(Math.random() * mask.length));

    return text;
}
