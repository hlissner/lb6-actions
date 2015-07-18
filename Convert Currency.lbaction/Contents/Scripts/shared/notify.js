/*
 * Included from ./shared/notify.js in root.
 *
 * Do not modify the copies of this file. Run "rake" in root to
 * propogate changes.
 */

var Lib = Lib || {};

Lib.Notify = {
    error: function(msg, data, header) {
        header = header || "LaunchBar error";
        msg = msg || "There was an unexpected error.";
        var args = [header, msg, "Ignore", "Report"];

        if (File.exists(Action.supportPath + "/Preferences.plist"))
            args.push("Preferences");

        if (data)
            LaunchBar.debugLog("ERROR: DATA=" + (data instanceof Object ? JSON.stringify(data) : data));

        switch (LaunchBar.alert.apply(LaunchBar, args)) {
            case 1:
                LaunchBar.openURL("https://github.com/hlissner/lb6-actions/issues");
                break;
            case 2:
                LaunchBar.openCommandURL("select?file="+encodeURIComponent(Action.supportPath)+"/Preferences.plist");
                break;
        }
    },

    force_prompt: function(data) {
        this.error("You forced this prompt to appear by holding down command.",
                   data, "Forced prompt");
    }
};
