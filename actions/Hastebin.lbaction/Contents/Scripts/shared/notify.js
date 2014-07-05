var Notify = {
    error: function(msg, data) {
        msg = msg || "There was an unexpected error.";

        LaunchBar.displayNotification({title: "LaunchBar Error", string: msg});
        if (data)
            LaunchBar.debugLog("ERROR: DATA=" + (data instanceof Object ? JSON.stringify(data) : data));
    }
};
