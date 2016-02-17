/*
 * Included from ./shared/path.js in root.
 *
 * Do not modify the copies of this file. Run "rake" in root to
 * propogate changes.
 */

var Lib = Lib || {};

Lib.Path = {
    scripts: Action.path + "/Contents/Scripts",

    basename: function(path) {
        if (!path) return "";
        return this._strip_slash(path.replace(/\\/g,'/')).replace(/.*\//, '');
    },

    dirname: function(path) {
        if (!path) return "";
        return this._strip_slash(path.replace(/\\/g,'/')).replace(/\/[^\/]+$/, '');
    },

    ext: function(path) {
        if (!path) return "";
        return path.split('.').pop();
    },

    _strip_slash: function(path) {
        if (path[path.length-1] === "/")
            return path.substr(0, path.length-1);
        return path;
    }
};
