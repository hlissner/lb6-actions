/**
 * Included from ./shared/lib.js in root.
 *
 * Do not modify the copies of this file. Run "rake" in root to
 * propogate changes.
 */

var Lib = Lib || {};

/**
 * Display a dialog prompt asking for input.
 *
 * @param {string} question What to ask the user
 * @return {string,bool} The entered text. False if cancelled.
 */
Lib.prompt = function(question) {
    var input = LaunchBar.executeAppleScript(
        'display dialog "'+question+'" default answer ""',
        'return text returned of result'
    ).trim();

    if (input.length === 0)
        return false;

    return input;
};

/**
 * Generate a unique ID of specified length.
 *
 * @param {int} len Length of the ID to generate
 * @return {string} The unique ID
 */
Lib.genUID = function(len) {
    len = len || 5;

    var text = "";
    var mask = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i=0; i < len; i++)
        text += mask.charAt(Math.floor(Math.random() * mask.length));

    return text;
};

Lib.copy = function(string) {
    LaunchBar.executeAppleScript("set the clipboard to \"" + string.replace(/"/g, '\"') + "\"");
};

String.prototype.flatten = function() {
    return this.replace(/(\r\n|\n|\r)/gm,"").trim();
};

String.prototype.trim_nl = function() {
    return this.replace(/^\s+|\s+$/g, '').trim();
};

String.prototype.encodeURIPath = function() {
    return encodeURIComponent(this).replace("%2F", "/");
};

String.prototype.wrap = function(width) {
    var str = this;
    var done = false;
    var res = '';
    var newLineStr = "\n";
    do {
        var found = false;
        for (i = width - 1; i >= 0; i--) {
            if (new RegExp(/^\s$/).test(str.charAt(i).charAt(0))) {
                res = res + [str.slice(0, i), newLineStr].join('');
                str = str.slice(i + 1);
                found = true;
                break;
            }
        }
        if (!found) {
            res += [str.slice(0, width), newLineStr].join('');
            str = str.slice(width);
        }

        if (str.length < width)
            done = true;
    } while (!done);

    return res + str;
};
