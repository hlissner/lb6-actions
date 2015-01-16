include("shared/history.js");
include("api.js");

function runWithString(string) {
    try {
        return parse(string);
    } catch (err) { LaunchBar.debugLog("ERROR="+err); }
}

function parse(input) {
    if (input.indexOf(" ") === -1) {
        // A history is kept of all the successful conversions done in the past (up to
        // 25 by default). While the user is typing the amount, past queries are offered
        // as suggestions.
        return Lib.History.suggestions(input).map(function(item) {
            return {title: item, icon: "at.obdev.LaunchBar:Text"};
        });
    }

    var _input = input.replace(/\s+/, " ").split(" ");
    var _input_len = _input.length;

    // If there are 2 or 4 words, the user is typing the currency codes. This is where
    // the suggestion magic happens.
    if (_input_len === 2 || _input_len === 4) {
        
        // We chop off what the user is currently typing so we can use this as the root
        // for suggestions.
        var actionArg = _input.splice(0, _input_len-1).join(" ") + " ";

        // API.suggest does a simple string.indexOf on both the currency's full name
        // (e.g. "Danish Krone") and the code (e.g. "DKK"); this makes it easier to type
        // in colloquial names, e.g. "5 yen", and have JPY suggested.
        //
        // Note: splice mutated _input in the line above, so there should only be one
        // word left in _input.
        return API.suggest(_input[0]).map(function(curr) {
            return {
                title: actionArg + curr.id + (_input_len === 2 ? " to " : ""),
                subtitle: curr.currencyName + " (" + curr.id + ")",
                icon: "money_silver"
            };
        });

    // In between 2 and 4 words the user is typing the delimiter (accepted delimiters:
    // to, in, and -); but this will ensure they get "[amt] [CODE] to " suggested.
    } else if (_input_len === 3) {
        return {
            title: _input.splice(0, _input_len-1).join(" ") + " to ",
            icon: "at.obdev.LaunchBar:EnterText"
        };
    }

    return [];
}
