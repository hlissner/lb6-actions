function runWithPaths(paths) {
    try {
        var items = [];
        for (var i = 0, len = paths.length; i < len; i++) {
            var item = {};

            var first_size = filesize(paths[i]) / 1000;

            if (!File.exists(paths[i])) {
                LaunchBar.displayNotification({title: "LaunchBar Error", string:"File does not exist: "+paths[i]});
                continue;
            }

            var new_path = paths[i];
            if (LaunchBar.options.alternateKey) {
                new_path = dirname(paths[i]) + '/min-' + basename(paths[i]);
                LaunchBar.execute('/bin/cp', '-p', paths[i], new_path);
                if (!File.exists(new_path)) throw "File couldn't be moved!";
            }

            var after_size = optimize(new_path) / 1000;
            var dsize = Math.abs(first_size - after_size) / first_size;

            item.path = new_path;
            item.title = basename(item.path);
            item.quickLookURL = "file://" + encodeURIComponent(item.path);
            item.actionArgument = item.path;

            if (dsize > 0.5) {
                item.subtitle = "Reduced by " + (dsize*100).toFixed(1) + "%: "
                    + first_size.toFixed(1) + "KB "
                    + " to " + after_size.toFixed(1) + "KB";
            } else {
                item.subtitle = "Could not be reduced further!";
            }
            items.push(item);
        }

        // Save these files into history
        return items.reverse();
    } catch(err) {
        LaunchBar.displayNotification({title: "LaunchBar Error", string:err});
        LaunchBar.log(paths.join(",\n"));
        return [];
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

function basename(path) {
    return path.replace(/^.*[\\\/]/, '');
}

function dirname(path) {
    return path.replace(/\\/g, '/').replace(/\/[^\/]*\/?$/, '');
}
