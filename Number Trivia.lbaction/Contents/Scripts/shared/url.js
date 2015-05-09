/*
 * Included from ./shared/url.js in root.
 *
 * Do not modify the copies of this file. Run "rake" in root to
 * propogate changes.
 */

var Lib = Lib || {};

Lib.URL = {
    hostname: function(url) {
        var start = url.indexOf('//');

        start = start !== -1 ? start + 2 : 0;

        var end =  url.indexOf('/', start);
        if (end === -1) return url.substr(start);

        return url.substr(start, end-start);
    },

    fqn: function(url) {
        url = url.trim();
        if (url.indexOf("http") !== 0)
            url = "http://" + url;
        return url;
    },

    dict2qs: function(obj) {
        var items = [];
        for (var key in obj)
            items.push(key + "=" + obj[key]);
        if (items.length > 0)
            return '?' + items.join("&");
        return "";
    }
};
