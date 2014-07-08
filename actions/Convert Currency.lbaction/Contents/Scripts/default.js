/*
 * TODO: Calculate new amount w/ exchange rates
 * TODO: Cache exchange rate for ~30 minutes
 */

include("shared/notify.js");
include("shared/url.js");
include("shared/request.js");

var API_URL = "http://www.google.com/finance/converter";

function runWithString(string) {
    string = string.trim();

    try {
        var match = string.match(/([\d\.]+)\s*([\w]{3})\s*(to|in|:)\s*([\w]{3})/);
        if (match === null || match.length != 5)
            throw "Your input wasn't formatted correctly!\nProper example: 100 USD to JPY";

        var amt = parseFloat(match[1]);
        var from = match[2];
        var to = match[4];

        var data = Request.get(API_URL, {a: amt, from: from, to: to});

        // Parse the html
        var result = data.match(/<div id=currency_converter_result>.+<span class=bld>([\d\.]+) ([\w]{3})<\/span>/);
        if (!result || result.length != 3)
            throw "Invalid currency code! ...or is Google Finance down?";

        // Assemble a readable string
        var new_amt = parseFloat(result[1]).toFixed(2);
        var res_from = amt + " " + from;
        var res_to = new_amt + " " + result[2];

        return [{ 
            title: res_to,
            subtitle: res_from + " | 1 " + to + " to " + (amt/new_amt).toFixed(3) + " " + from,
            actionArgument: string,
            icon: "money_gold"
        }];
    } catch (err) {
        Notify.error(err);
    }
}
