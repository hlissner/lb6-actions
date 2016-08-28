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
 *
 */
Lib.choosePrompt = function(question, choices, title,
                            ok_label, cancel_label,
                            default_value) {
    if (!title || title.trim() == "") {
        title = "Give a choice";
    }
    if (!ok_label) {
        ok_label = "Ok";
    }
    if (!cancel_label) {
        cancel_label = "Cancel";
    }

    var input = LaunchBar.executeAppleScript(
        'choose from list {"' + choices.join(", ") + '"}' +
            ' with title "' + title + '"' +
            ' with prompt "' + question + '"' +
            ' OK button name "' + ok_label + '"' +
            ' cancel button name "' + ok_label + '"' +
            ' default items {"' + default_value + '"}'
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

/**
 * Copy a string to the clipboard.
 *
 * @param {string} string The text to copy to the clipboard
 */
Lib.copy = function(string) {
    LaunchBar.executeAppleScript('set the clipboard to "' + string.replace(/"/g, '\"') + "\"");
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

/**
 * Asserts that condition is true, otherwise throw an error.
 *
 * @param {bool} condition - The assertion
 * @param {string} message - The error message to throw if assertion fails
 */
Lib.assert = function(condition, message) {
    if (!condition) {
        throw message || "Assertion failed";
    }
};

/**
 * Asserts that a value is a certain datatype, otherwise throw an error.
 *
 * @param {mixed} value - The value to be tested
 * @param {string} type - The expected datatype
 * @param {bool} optional - Whether 'undefined' or 'null' are acceptable values
 */
Lib.assertType = function(value, type, optional) {
    if (optional && (value == undefined || value == null)) {
        return;
    }
    if (typeof value != type) {
        throw "Expected " + type + ", got " + typeof value;
    }
};
