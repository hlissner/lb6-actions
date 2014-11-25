include("shared/history.js");

function runWithString(address) {
    return Lib.History.suggestions(address).map(function(loc) {
        return {
            title: loc,
            icon: "at.obdev.LaunchBar:ABLocation"
        };
    });
}
