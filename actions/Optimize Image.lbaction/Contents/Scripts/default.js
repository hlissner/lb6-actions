include("shared/lib.js");
include("shared/path.js");
include("shared/notify.js");

function runWithPaths(paths) {
    try {
        return paths.map(function(path) {
            var item = {};

            var first_size = filesize(path) / 1000;
            if (!File.exists(path)) {
                return [{
                    title: File.basename(path),
                    path: path,
                    icon: "404"
                }];
            }

            // If alt is down, make a copy of the file so as to not 
            // operate on the original
            var new_path = path;
            if (LaunchBar.options.alternateKey) {
                new_path = Path.dirname(path) + '/min-' + Path.basename(path);
                LaunchBar.execute('/bin/cp', '-p', path, new_path);

                if (!File.exists(new_path)) 
                    throw "File couldn't be moved!";
            }

            var after_size = optimize(new_path) / 1000;
            var dsize = Math.abs(first_size - after_size) / first_size;

            item.path = new_path;
            item.title = Path.basename(item.path);
            item.quickLookURL = "file://" + item.path.encodeURIPath();
            item.actionArgument = item.path;

            if (dsize > 0.5) {
                item.subtitle = "Reduced by " + (dsize*100).toFixed(1) + "%: "
                    + first_size.toFixed(1) + "KB "
                    + " to " + after_size.toFixed(1) + "KB";
                item.icon = "y";
            } else {
                item.subtitle = "Could not be reduced further!";
                item.icon = "n";
            }

            return item;
        }).reverse();
    } catch(err) {
        Notify.error(err);
    }
}

/**
 * Optimizes the image using ImageAlpha (http://pngmini.com) and ImageOptim
 * (https://imageoptim.com).
 **/
function optimize(path) {
    var ext = path.split('.').pop();

    if (ext === "png") {
        if (File.exists("/Applications/ImageAlpha.app")) {
            LaunchBar.execute('/Applications/ImageAlpha.app/Contents/Resources/pngquant', '--force', '--ext', '.png', path);
            LaunchBar.debugLog("ImageAlpha used");
        } else {
            Notify.error("ImageAlpha couldn't be found!");
        }
    }

    if (LaunchBar.options.shiftKey) {
        // ImageOptim: https://imageoptim.com
        if (File.exists("/Applications/ImageOptim.app")) {
            LaunchBar.execute('/Applications/ImageOptim.app/Contents/MacOS/ImageOptim', path);
            LaunchBar.debugLog("ImageOptim used");
        } else {
            Notify.error("ImageOptim couldn't be found!");
        }
    }

    return filesize(path);
}

/**
 * @param file Path to the file
 * @return int the filesize in bytes
 */
function filesize(file) {
    var out = LaunchBar.execute(Action.path + '/Contents/Scripts/get_filesize.sh', file);
    if (out === undefined || out.trim() === "")
        throw "Filesize couldn't be ascertained for: "+basename(file);

    return parseInt(out);
}
