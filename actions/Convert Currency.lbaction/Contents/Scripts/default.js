/*
 * TODO: Cache exchange rate for ~30 minutes
 */

var API_URL = "http://www.google.com/finance/converter";

function runWithString(string) {
    string = string.trim();

    try {
        var match = string.match(/([\d\.]+)\s*([\w]+)\s*to\s*([\w]+)/);
        if (match === null || match.length != 4)
            throw "Your input wasn't formatted correctly!\nProper example: 100 USD to JPY";

        var amt = parseFloat(match[1]);
        var from = match[2];
        var to = match[3];

        var data = request(API_URL + 
            "?a=" + amt + 
            "&from=" + from + 
            "&to=" + to
        );

        // Parse the html
        var result = data.match(/<div id=currency_converter_result>.+<span class=bld>([\d\.]+) ([\w]{3})<\/span>/);
        if (result === null || result.length != 3)
            throw "Invalid currency code! ...or is Google Finance down?";

        // Assemble a readable string
        var res_from = amt + " " + from;
        var res_to = result[1] + " " + result[2];

        return [{ 
            title: res_to,
            subtitle: res_from,
            actionArgument: string,
            icon: "money_gold"
        }];
    } catch (err) {
        LaunchBar.displayNotification({title: "LaunchBar Error", string: err});
    }
}

function request(url) {
    var resp = HTTP.get(url);
    if (resp.error !== undefined) {
        switch (resp.response.status) {
            case 500:
                throw "There was an error on Google Finance's end. Try again later.";
            case 200:
                throw "Something else went wrong. Maybe Google Finance is returning a malformed response? Please report this to henrik@lissner.net";
        }

        throw "Something went wrong!";
    }
    
    return resp.data;
}
