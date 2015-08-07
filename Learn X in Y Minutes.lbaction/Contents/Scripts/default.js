include("shared/lib/cache.js");

function runWithString(string) {
    if (LaunchBar.options.controlKey) {
        Lib.Cache.clearAll();
        return;
    }
    
    LaunchBar.openURL("http://learnxinyminutes.com/docs/" + string.toLowerCase());
}
