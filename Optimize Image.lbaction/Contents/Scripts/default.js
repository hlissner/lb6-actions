include("shared/lib/lib.js");
include("shared/lib/path.js");
include("shared/lib/notify.js");

function runWithPaths(paths) {
    if (Action.preferences.ImageOptim_path === undefined) {
        Action.preferences.ImageOptim_path = "/Applications/ImageOptim.app";
    }
    if (Action.preferences.ImageAlpha_path === undefined) {
        Action.preferences.ImageAlpha_path = "/Applications/ImageAlpha.app";
    }
    if (LaunchBar.options.commandKey) {
        return Lib.Notify.force_prompt();
    }

    try {
        if (paths.length > 1) {
            // Only show a this message if more than 1 file
            LaunchBar.displayNotification({
                title: "LaunchBar 6",
                string: "Optimizing " + paths.length + " file(s)"
            });
        }
        return paths.map(function(path) {
            var first_size = filesize(path) / 1000;
            if (!File.exists(path)) {
                return {"title": Lib.Path.basename(path), "path": path, "icon": "404"};
            }

            // If alt is down, make a copy of the file so as to not
            // operate on the original
            var new_path = path;
            if (LaunchBar.options.alternateKey) {
                new_path = Lib.Path.dirname(path) + '/min-' + Lib.Path.basename(path);
                LaunchBar.debugLog("CMD=/bin/cp -p " + path + " " + new_path);
                LaunchBar.execute('/bin/cp', '-p', path, new_path);

                if (!File.exists(new_path))
                    throw "File couldn't be moved!";
            }
            LaunchBar.debugLog("STAGE=1");

            var after_size = optimize(new_path) / 1000;
            var dsize = Math.abs(first_size - after_size) / first_size;

            var item = {};
            item.title = Lib.Path.basename(new_path);

            LaunchBar.debugLog("STAGE=2");

            // We can't link to the filepath because of a bug in LB6.1+ where an
            // item.path causes all other fields of item to be hidden.
            // item.path = new_path;
            item.quickLookURL = 'file://' + new_path.encodeURIPath();
            item.url = 'file://' + new_path.encodeURIPath();

            if (dsize > 0.01) {
                var diff = (dsize * 100).toFixed(1);
                if (paths.length == 1) {
                    item.subtitle = 'Reduced by ' + diff + '%: ' +
                        first_size.toFixed(1) + 'KB' +
                        ' to ' +
                        after_size.toFixed(1) + 'KB';
                }
                item.badge = '-' + diff + '%';
                item.label = first_size.toFixed(1) + 'kb' + ' > ' + after_size.toFixed(1) + 'kb';
                item.icon = 'y';
            } else {
                if (paths.length == 1) {
                    item.subtitle = "Can't be reduced further";
                }
                item.badge = "0%";
                item.icon = 'n';
            }

            LaunchBar.debugLog("STAGE=3");

            LaunchBar.debugLog(item.subtitle);
            return item;
        });
    } catch (err) {
        Lib.Notify.error(err);
    }
}

/**
 * Optimizes the image using ImageAlpha (http://pngmini.com) and ImageOptim
 * (https://imageoptim.com).
 *
 * @param {string} path The path to the image file to optimize
 * @return {int} The resulting filesize of the optimized image
 */
function optimize(path) {
    var ext = path.split('.').pop();

    if (ext === "png") {
        if (File.exists(Action.preferences.ImageAlpha_path)) {
            LaunchBar.execute(Action.preferences.ImageAlpha_path + '/Contents/Resources/pngquant', '--force', '--ext', '.png', path);
            LaunchBar.debugLog("CALL=ImageAlpha");
        } else {
            Lib.Notify.error("ImageAlpha couldn't be found!");
        }
    }

    if (LaunchBar.options.shiftKey) {
        // ImageOptim: https://imageoptim.com
        if (File.exists(Action.preferences.ImageOptim_path)) {
            LaunchBar.execute(Action.preferences.ImageOptim_path + '/Contents/MacOS/ImageOptim', path);
            LaunchBar.debugLog("CALL=ImageOptim");
        } else {
            Lib.Notify.error("ImageOptim couldn't be found!");
        }
    }

    return filesize(path);
}

/**
 * Get the size of a file in bytes, using the get_filesize.sh script.
 *
 * @param {string} file The file Path
 * @return {int} The filesize in bytes
 */
function filesize(file) {
    var script_path = Action.path + '/Contents/Scripts/get_filesize.sh';
    if (!File.exists(script_path))
        throw "Internal script couldn't be found.";

    var out = LaunchBar.execute(script_path, file);
    LaunchBar.debugLog("CMD=" + script_path);
    if (out === undefined || out.trim() === "")
        throw "Filesize couldn't be ascertained for: " + Lib.Path.basename(file);

    return parseInt(out);
}
