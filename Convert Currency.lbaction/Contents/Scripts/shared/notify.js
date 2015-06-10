/*
 * Included from ./shared/notify.js in root.
 *
 * Do not modify the copies of this file. Run "rake" in root to
 * propogate changes.
 */

var Lib = Lib || {};

Lib.Notify = {
    error: function(msg, data) {
        msg = msg || "There was an unexpected error.";

        if (data)
            LaunchBar.debugLog("ERROR: DATA=" + (data instanceof Object ? JSON.stringify(data) : data));
        // LaunchBar.displayNotification({title: "LaunchBar Error", string: msg});
        return LaunchBar.alert("Launchbar Error", msg);
    }
};
