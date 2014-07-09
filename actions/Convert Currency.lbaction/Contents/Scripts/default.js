/*
 * TODO: Calculate new amount w/ exchange rates
 * TODO: Cache exchange rate for ~30 minutes
 */

include("shared/notify.js");
include("shared/history.js");
include("api.js");

function runWithString(string) {
    string = string.trim();

    try {
        var match = string.match(/([\d\.]+)\s*([\w]{3})\s*(to|in|:)\s*([\w]{3})/);
        if (match === null || match.length != 5)
            throw "Your input wasn't formatted correctly!\nProper example: 100 USD to JPY";

        var amt = parseFloat(match[1]).toFixed(2);
        var from = match[2];
        var to = match[4];

        var rate = API.get_rate(from, to);
        History.add(string);
        if (LaunchBar.options.controlKey)
            History.clear();

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
                title: "1 " + to + " = " + rate.toFixed(5) + " " + from,
                subtitle: "Exchange Rate",
                actionArgument: rate.toString(),
                icon: "at.obdev.LaunchBar:CalculatorResult"
            }
        ];
    } catch (err) {
        Notify.error(err);
    }
}
