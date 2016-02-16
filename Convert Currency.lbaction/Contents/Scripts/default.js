include("shared/lib/notify.js");
include("shared/lib/history.js");
include("api.js");

function runWithString(string) {
    if (LaunchBar.options.commandKey) {
        return Lib.Notify.force_prompt();
    }

    string = string.trim();
    try {
        var match = string.replace(",","").match(/([\d\.]+)\s*([\w]{3})\s*(to|in|:)\s*([\w]{3})/);
        if (match === null || match.length != 5)
            throw "Your input wasn't formatted correctly!\n\nProper example: 100 USD to JPY";

        var amt = parseFloat(match[1]).toFixed(2);
        var from = match[2].toUpperCase();
        var to = match[4].toUpperCase();

        var rate = API.get_rate(from, to);
        Lib.History.add(string);
        if (LaunchBar.options.controlKey) {
            Lib.History.clear();
            clearCache(from, to);
        }

        var new_amt = Math.round(((amt * rate) * 100).toFixed(0)) / 100;

        return [
            {
                title: new_amt + " " + to,
                subtitle: "Result",
                icon: "money_gold"
            },
            {
                title: amt + " " + from,
                subtitle: "From",
                icon: "money_silver"
            },
            {
                title: "1 " + from + " = " + rate.toFixed(5) + " " + to,
                subtitle: "Exchange Rate",
                actionArgument: rate.toString(),
                icon: "at.obdev.LaunchBar:CalculatorResult"
            }
        ];
    } catch (err) {
        if (from && to) {
            clearCache(from, to);
        }
        Lib.Notify.error(err);
    }
}

function clearCache(from, to) {
    Lib.Cache.clear(from + "-" + to);
    Lib.Cache.clear(to + "-" + from);
}
