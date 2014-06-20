
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
        LaunchBar.alert("Error connecting to google finance");
        return [];
    }

    // Parse the html
    var result = resp.data.match(/<div id=currency_converter_result>.+<span class=bld>([\d\.]+) ([\w]{3})<\/span>/);
    if (result.length != 3) {
        LaunchBar.alert("Error parsing data from google finance");
        return [];
    }

    // Assemble a readable string
    var res_str = amt + " " + from + " → " + result[1] + " " + result[2];

    return [{ 
        title: res_str,
        actionArgument: res_str
    }];
}
