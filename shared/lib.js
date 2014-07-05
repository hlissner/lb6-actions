/**
 * Included from ./shared/lib.js in root.
 *
 * Do not modify the copies of this file. Run "rake" in root to
 * propogate changes.
 */

/**
 * Display a dialog prompt asking for input.
 *
 * @param string question What to ask the user
 * @return string/bool The entered text. False if cancelled.
 */
function prompt(question) {
    var input = LaunchBar.executeAppleScript(
        'display dialog "'+question+'" default answer ""',
        'return text returned of result'
    ).trim();

    if (input.length === 0)
        return false;

    return input;
}

function php(args) {
    if (!args || !args instanceof Object)
        args = [];

    args.unshift("/usr/bin/php");
    return LaunchBar.execute(args);
}

String.prototype.flatten = function() {
    return this.replace(/(\r\n|\n|\r)/gm,"").trim();
};

String.prototype.trim_nl = function() {
    return this.replace(/^\s+|\s+$/g, '').trim();
};

String.prototype.encodeURIPath = function() {
    return encodeURIComponent(string).replace("%2F", "/");
};
