include("shared/notify.js");

function run() {
    var d = new Date();
    var ds = "" + d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate() +
            "_" + d.getHours() + '-' + d.getMinutes() + '-' + d.getSeconds() +
            "_" + d.getMilliseconds();

    var tmp_path   = '/tmp/sc_' + ds + '.png';
    var dest_path  = LaunchBar.homeDirectory + '/Downloads/sc_' + ds + '.png';
    try {
        // If shift key is down, capture the screen
        LaunchBar.execute('/usr/sbin/screencapture', '-i', tmp_path);
        if (!File.exists(tmp_path)) throw "File doesn't exist!";

        LaunchBar.execute('/bin/cp', '-p', tmp_path, dest_path);
        if (!File.exists(dest_path)) throw "File couldn't be moved!";

        if (optimize(dest_path) === 0)
            LaunchBar.debugLog("File was not optimized. No optimizer found!");

        // This action runs in the background, but this allows it to resurface when the
        // image file is ready.
        LaunchBar.openCommandURL('select?file=' + encodeURIComponent(dest_path));
    } catch (err) {
        Lib.Notify.error(err);
    }
}

/**
 * The image is optimized with ImageAlpha (if available). Hold down alt and
 * ImageOptim will also have a go at the file (if available).
 *
 * @param {string} path The path to the image file
 * @return {int} Returns 0 if unoptimized, 1 if ImageAlpha was used, 2 for ImageOptim
 */
function optimize(path) {
    var stage = 0;

    // ImageAlpha: http://pngmini.com/
    if (File.exists("/Applications/ImageAlpha.app")) {
        LaunchBar.execute('/Applications/ImageAlpha.app/Contents/Resources/pngquant', '--force', '--ext', '.png', path);
        LaunchBar.debugLog("ImageAlpha used");
        stage++;
    }

    if (LaunchBar.options.alternateKey) {
        // ImageOptim: https://imageoptim.com
        if (File.exists("/Applications/ImageOptim.app")) {
            LaunchBar.execute('/Applications/ImageOptim.app/Contents/MacOS/ImageOptim', path);
            LaunchBar.debugLog("ImageOptim used");
            stage++;
        }
    }

    return stage;
}
