
function runWithString(string) {
    string = string.trim();

    var match = string.match(/([\d\.]+)\s*([\w]+)\s*to\s*([\w]+)/);
    if (match.length != 4) {
        return [];
    }

    var amt = parseFloat(match[1]);
    var from = match[2];
    var to = match[3];

    var resp = HTTP.get("http://www.google.com/finance/converter?a=" + amt + "&from=" + from + "&to=" + to);
    if (resp === undefined || resp.error !== undefined) {
        var msg = "Something went wrong!";
        switch (resp.response.status) {
            case 500:
                msg = "There was an error on Google Finance's end. Try again later.";
                break;
            case 200:
                msg = "Something else went wrong. Maybe Google Finance is returning a malformed response? Please report this to henrik@lissner.net";
                break;
        }
        LaunchBar.displayNotification({title: "LaunchBar Error", string: msg});
        return [];
    }

    // Parse the html
    var result = resp.data.match(/<div id=currency_converter_result>.+<span class=bld>([\d\.]+) ([\w]{3})<\/span>/);
    if (result === null || result === undefined || result.length != 3) {
        LaunchBar.displayNotification({title: "LaunchBar Error", string: "Your input wasn't formatted correctly!\nProper example: 100 USD to JPY"});
        return [];
    }

    // Assemble a readable string
    var res_from = amt + " " + from;
    var res_to = result[1] + " " + result[2];

    return [{ 
        title: res_to,
        subtitle: res_from,
        actionArgument: res_to,
        icon: "money_gold.png"
    }];
}
