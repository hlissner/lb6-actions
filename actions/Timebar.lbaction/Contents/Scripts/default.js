include("shared/notify.js");

function runWithString(time_str) {
    time_str = time_str.trim().toLowerCase();

    var argv = [Action.path + "/Contents/Scripts/timebar"];
    switch(time_str) {
        case "stop":
            argv.push("--stop");
            break;
        default:
            argv.push("--parse");
            argv.push(time_str);
    }

    var resp = LaunchBar.execute(argv);
    if (resp)
        Notify.error(resp);
}
