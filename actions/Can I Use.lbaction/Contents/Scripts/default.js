include("shared/lib.js");
include("shared/cache.js");

function runWithString(string) {
    return Data.get().filter(function(item) {
        return item.title.toLowerCase().indexOf(string) != -1;
    });
}

//
var Data = {
    DATA_URL: 'https://raw.githubusercontent.com/Fyrd/caniuse/master/data.json',

    get: function() {
        var ts = Date.now() / 1000;

        var list = Lib.Cache.get("list", true);
        if (!list || Action.debugLogEnabled || LaunchBar.options.controlKey) {
            var data = JSON.parse(LaunchBar.execute(
                "/usr/bin/php",
                Action.path + "/Contents/Scripts/filter.php",
                this.DATA_URL
            ));

            list = data.map(function(feature) {
                return {
                    title: format_title(feature),
                    subtitle: feature.description,
                    icon: 'iconTemplate',
                    url: "http://caniuse.com/#feat=" + feature.id
                };
            });

            Lib.Cache.set("list", list, 86400*7);
        }

        return list;
    },
};

function format_title(data) {
    var title = data.title;
    data.categories.map(function(cat) {
        if (title.indexOf(cat) === 0)
            title = title.substr(cat.length+1);
    });

    return data.categories.join(",") + ": " + title.charAt(0).toUpperCase() + title.substr(1);
}
