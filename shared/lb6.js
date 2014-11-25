/**
 * LaunchBar Javascript API
 *
 * For use with auto-completion libraries.
 */

// Included to hide "unused function" warnings
run();
runWithItem({});
runWithPaths({});
runWithString("");


// String amendments

/**
 * @type {string}
 */
String.prototype.localizationTable = "";

/**
 *
 * @param {String} localizationTable
 * @return {String}
 */
String.prototype.localize = function(localizationTable) {};

// TODO JSDoc these
String.prototype.toBase64Data = function(options) {};
String.prototype.toBase64String = function(options) {};
String.prototype.toData = function(options) {};
String.prototype.toDataFromBase64String = function(options) {};
String.prototype.toStringFromBase64String = function(options) {};
String.prototype.toStringUsingEncoding = function(encoding) {};
String.prototype.toUTF8String = function() {};
String.prototype.toUint8Array = function() {};

// Global functions

/**
 * Allows you to use another script's code by including it into your script.
 * @param {String} path The path of the script to include, relative to the Action's Scripts directory.
 * @return The result of the script evaluation.
 */
function include(path) {}

var Action = {
    path: "",
    scriptType: "",
    version: "",
    shortVersion: "",
    bundleIdentifier: "",
    cachePath: "",
    supportPath: "",
    debugLogEnabled: false,
    preferences: {}
};

var File = {
    exists: function(path) {},
    isDirectory: function(path) {},
    createDirectory: function(path) {},
    isReadable: function(path) {},
    isWritable: function(path) {},
    isExecutable: function(path) {},
    displayName: function(path) {},
    getDirectoryContents: function(path, options) {},
    readPlist: function(path) {},
    writePlist: function(plist, path, options) {},
    readJSON: function(path) {},
    writeJSON: function(JSON, path, options) {},
    readText: function(path, encoding) {},
    writeText: function(text, path, encoding) {},
    readData: function(path) {},
    writeData: function(data, path) {},
    pathFromBookmarkData: function(data, options) {},
    pathFromBookmarkAtPath: function(path, options) {},
    fileURLForPath: function(path) {},
    pathForFileURL: function(path) {}
};

var HTTP = {
    get: function(URL, timeout_or_options) {},
    getJSON: function(URL, timeout_or_options) {},
    getPlist: function(URL, timeout_or_options) {},
    getData: function(URL, timeout_or_options) {},
    post: function(URL, timeout_or_options) {},
    postJSON: function(URL, timeout_or_options) {},
    postPlist: function(URL, timeout_or_options) {},
    postData: function(URL, timeout_or_options) {},
    loadRequest: function(URL, timeout_or_options) {}
};

// LaunchBar ...
var LaunchBar = {
    /**
     * The current locale of the system, like “en” or “de”.
     */
    currentLocale: "",

    /**
     * The path to the LaunchBar.app bundle.
     */
    path: "",

    /**
     * Corresponds to CFBundleVersion in LaunchBar's Info.plist.
     */
    version: "",

    /**
     * Corresponds to CFBundleIdentifier in the LaunchBar's Info.plist.
     */
    bundleIdentifier: "",

    /**
     * The home directory of the logged–in user, e.g. '/Users/marco'.
     */
    homeDirectory: "",

    /**
     * The name of the logged–in user.
     */
    userName: "",

    /**
     * The ID of the logged-in user.
     */
    userID: 0,

    /**
     * The computer's host name.
     */
    hostName: "macbook-pro.local",

    /**
     * The computer's name (see System Profeerences' sharing panel).
     */
    computerName: "MacBook Pro",

    /**
     * The OSX version of the system
     */
    systemVersion: "10.10.1",

    /**
     * An Object representing options for running the action.
     */
    options: {
        /* If the command key is down. */
        commandKey: false,
        /* If the option key is down. */
        alternateKey: false,
        /* If the shift key is down. */
        shiftKey: false,
        /* If the control key is down. */
        controlKey: false,
        /* Indicates whether the action is run in the background or not. */
        runInBackground: false,
        /*
         * For this to be set, the script must have it's
         * LBLiveFeedbackEnabled set to true in the Action's Info.plist
         * and the user must have initiated text input.
         */
        liveFeedback: false
    },

    /**
     * Logs the given string to LaunchBar's stderr, prefixed with the
     * current date and time, the action's name and bundle identifier.
     *
     * @param {String} message
     */
    log: function(message) {},

    /**
     * If the action's Info.plist has LBDebugLogEnabled set to YES
     * (Boolean), behaves like log; otherwise does nothing.
     *
     * @param {String} message
     */
    debugLog: function(message) {},

    /**
     * Presents a modal alert with the given message and optional
     * info.
     *
     * If only one or two arguments are provided, there will only be
     * one button labeled 'OK'. If there are three arguments, the
     * third one is the label for the only button. Any additional
     * arguments cause buttons to be added to the alert.
     *
     * @param {String} message The alert's message. Will be displayed in bold text.
     * @param {String} [info] Additional information that appears below the message.
     * @param {String} [buttonTitle1] The title of the alert's default button
     * @param {String} [...] Additional button titles
     * @return {int} A Number corresponding to the index of the button
     *               clicked, whereas the right–most button has index 0 and
     *               increases from right to left.
     */
    alert: function(message, info, buttonTitle1) {},

    /**
     * Opens an arbitrary URL.
     *
     * If appName is given (e.g. 'QuickTime Player'), opens the URL
     * with that app, otherwise with the default app for the URL’s
     * scheme.
     *
     * @param {String} URL The URL to open. Any scheme that OS X supports is fine.
     * @param {String} [appName] The name of the app with which to open the URL.
     * @param {bool} [hideOthers] The name of the app with which to open the URL.
     */
    openURL: function(URL, appName, hideOthers) {},

    displayNotification: function(string, title, subtitle, url, delay) {},

    displayInLargeType: function(string, title, font, sound, delay) {},

    openQuickLook: function(URL) {},

    closeQuickLook: function() {},

    performAction: function(actionName, argument) {},

    performService: function(serviceName, argument) {},

    openCommandURL: function(commandURL) {},

    paste: function(string) {},

    getClipboardString: function() {},

    execute: function(launchPath, argument) {},

    executeAppleScript: function(script) {},

    executeAppleScriptFile: function(path, argument1) {}
};
