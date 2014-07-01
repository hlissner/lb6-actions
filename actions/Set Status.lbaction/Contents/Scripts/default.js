function run() {
    return [
        {title: "Available", icon: "online", action: "set_status", actionArgument: "0", actionRunsInBackground: true},
        {title: "Away", icon: "away", action: "set_status", actionArgument: "1", actionRunsInBackground: true},
        {title: "Do Not Disturb", icon: "dnd", action: "set_status", actionArgument: "2", actionRunsInBackground: true},
        {title: "Invisible", icon: "offline", action: "set_status", actionArgument: "3", actionRunsInBackground: true}
    ];
}

function set_status(status) {
    if (Action.preferences.sound === undefined)
        Action.preferences.sound = "/System/Library/Sounds/Pop.aiff";

    LaunchBar.execute("/usr/bin/osascript", "set_status.applescript", status);
}
