var CLI_PATH = Action.path + "/Contents/Scripts/timebar";

function runWithString(time_str) {
    var resp;
    if (time_str.toLowerCase() === "stop") {
        resp = LaunchBar.execute(CLI_PATH, "--stop");
    } else {
        resp = LaunchBar.execute(CLI_PATH, "--parse", time_str);
    }

    return [{title: resp}];
}
