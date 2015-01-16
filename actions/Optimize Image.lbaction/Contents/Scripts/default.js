include("shared/lib.js");
include("shared/path.js");
include("shared/notify.js");

function runWithPaths(paths) {
    try {
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
                LaunchBar.execute('/bin/cp', '-p', path, new_path);

                if (!File.exists(new_path))
                    throw "File couldn't be moved!";
            }

            var after_size = optimize(new_path) / 1000;
            var dsize = Math.abs(first_size - after_size) / first_size;

            var item = {};
            item.title = Lib.Path.basename(new_path);

            // We can't link to the filepath because of a bug in LB6.1+ where an
            // item.path causes all other fields of item to be hidden.
            //item.path = new_path;
            //item.quickLookURL = 'file://' + new_path.encodeURIPath();
            //item.actionArgument = new_path;

            if (dsize > 0.01) {
                item.subtitle = 'Reduced by ' + (dsize * 100).toFixed(1) + '%: ' +
                    first_size.toFixed(1) + 'KB' +
                    ' to ' +
                    after_size.toFixed(1) + 'KB';
                item.icon = 'y';
            } else {
                item.subtitle = 'Could not be reduced further!';
                item.icon = 'n';
            }

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
        if (File.exists("/Applications/ImageAlpha.app")) {
            LaunchBar.execute('/Applications/ImageAlpha.app/Contents/Resources/pngquant', '--force', '--ext', '.png', path);
            LaunchBar.debugLog("ImageAlpha used");
        } else {
            Lib.Notify.error("ImageAlpha couldn't be found!");
        }
    }

    if (LaunchBar.options.shiftKey) {
        // ImageOptim: https://imageoptim.com
        if (File.exists("/Applications/ImageOptim.app")) {
            LaunchBar.execute('/Applications/ImageOptim.app/Contents/MacOS/ImageOptim', path);
            LaunchBar.debugLog("ImageOptim used");
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
    if (out === undefined || out.trim() === "")
        throw "Filesize couldn't be ascertained for: " + Lib.Path.basename(file);

    return parseInt(out);
}
