function run() {
    // Inspired by 
    var d = new Date();
    var ds = "" + d.getFullYear() + (d.getMonth()+1) + d.getDate() 
        + "_" + d.getHours() + d.getMinutes() + d.getSeconds()
        + "_" + d.getMilliseconds();

    var tmp_path = '/tmp/sc_' + ds + '.png';
    var dest_path = LaunchBar.homeDirectory + '/Downloads/sc_' + ds + '.png';
    try {
        // If shift key is down, capture the screen
        LaunchBar.execute('/usr/sbin/screencapture', '-i', tmp_path);
        if (!File.exists(tmp_path)) throw "File doesn't exist!";

        LaunchBar.execute('/bin/cp', '-p', tmp_path, dest_path);
        if (!File.exists(dest_path)) throw "File couldn't be moved!";

        // Put the image through any available optimizer (if any), BUT
        // only optimize if alt/option is held down.
        if (LaunchBar.options.alternateKey) {
            if (optimize(dest_path) === 0)
                LaunchBar.log("File was not optimized. Not optimizer found!");
        } 
        else LaunchBar.log("Optimize cancelled");

        // This action runs in the background, but this allows it to resurface when the
        // image file is ready.
        LaunchBar.openCommandURL('select?file='+encodeURIComponent(dest_path));
    } catch (err) {
        LaunchBar.displayNotification({title: "LaunchBar Error", string: err});
    }
}


/**
 * Try to put the image through ImageAlpha and then ImageOptim, in that order.
 * I assume if you want to optimize your image, you want to go all out.
 */
function optimize(path) {
    var optimized = 0;

    // Detect file extension
    if (File.exists("/Applications/ImageAlpha.app")) {
        LaunchBar.execute('/Applications/ImageAlpha.app/Contents/Resources/pngquant', '--force', '--ext', '.png', path);
        optimized = 1;
    }

    // ImageOptim: https://imageoptim.com
    if (File.exists("/Applications/ImageOptim.app")) {
        LaunchBar.execute('/Applications/ImageOptim.app/Contents/MacOS/ImageOptim', path);
        optimized = 2;
    }

    return optimized;
}
