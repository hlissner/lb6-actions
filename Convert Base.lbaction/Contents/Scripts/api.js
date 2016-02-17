include("shared/lib/lib.js");
include("shared/lib/notify.js");

function evaluate(num, from, to, literal) {
    if (from < 2 || from > 36 || to < 2 || to > 36) {
        throw "Invalid radix; this converter only supports 2 <= r <= 36";
    }

    // Convert it to intermediary radix (base 10) and work from there
    var result = from10(to10(num, from), to);

    return {
        title: literal ? result.toString() + "_" + to + " " + from : format(result, to, from),
        label: "Base " + to,
        icon: "CalculatorResult",
        children: [{
            title: result,
            subtitle: "Unformatted result",
            label: "Base " + to
        }]
    };
}

/**
 * Format a number with commas (or spaces with binary) as appropriate.
 *
 * @param {string} nstr - The number string to be formatted
 * @param {int} base - The base nstr is in
 * @return {string} - The formatted number
 */
function format(nstr, base) {
    Lib.assert(typeof nstr == "string", "format(" + nstr + ", ...): not a string!");
    Lib.assert(isNumeric(base), "format(..., " + base + "): not a number!");

    var re = new RegExp("\\B(?=([0-9a-z]{" + (base == 2 ? 4 : 3) + "})+(?![0-9a-z]))", "gi");
    return nstr.replace(re, (base == 2 ? " " : ","));
}

/**
 * Parses the input.
 *
 * @param  {string} string       - The raw input from Launchbar
 * @return {Object} data         - Information about the number
 * @return {string} data.num     - The number to be converted
 * @return {int}    data.from    - The radix to be converted from
 * @return {int}    data.to      - The radix to be converted to
 * @return {bool}   data.guessed - Whether or not data.from was guessed from data.num
 */
function parse(string) {
    Lib.assert(typeof string == "string", "parse(string): not an string!");
    Lib.assert(string.trim() != "", "parse(string): string is empty!");
    Lib.assert(string.search(/[^0-9a-zA-Z,._ ]+/) == -1, "Invalid input!");

    var parts = string.split(" ");
    var data = {
        num:  parts[0].toLowerCase(),
        to:   parts.length > 1 ? parseInt(parts[1]) : null,
        from: 10,
        guessed: true
    };
    data.num = data.num.replace(/[, ]/g, "");

    if (data.num.indexOf("_") != -1) {
        var _num = data.num.split("_");
        data.num = _num[0];
        data.from = parseInt(_num[1]);
        data.guessed = false;
    } else {
        data.from = guessBase(data.num);
    }

    return data;
}

/**
 * Converts [num] to base 10, from base [from]
 *
 * @param {string} num - The number to convert
 * @param {int} from - The source radix
 * @return {float} - The converted number in decimal
 */
function to10(num, from) {
    Lib.assert(typeof num == "string", "to10(" + num + ", ...): not a string!");
    Lib.assert(isNumeric(from), "to10(..., " + from + "): not a number!");

    if (from == 10) {
        return parseFloat(num);
    }

    var digits = num;
    var n, m;

    if ((n = digits.indexOf(".")) == -1) {
        n = digits.length;
        m = 0;
    } else {
        m = -(digits.length - (n + 1));
    }
    --n;

    var result = 0;
    for (var j = 0, i = n; i >= m; --i, j = (n - m) - i) {
        if (digits[j] != "0") {
            result += (parseInt(digits[j], from) * Math.pow(from, i));
        }
    }
    return result;
}

/**
 * Converts [num] to N in base [to]
 *
 * @param  {Number} num - The number to convert
 * @param  {int}    to  - Radix to convert to
 * @return {Number} - Converted amount in new base
 */
function from10(num, to) {
    Lib.assert(isNumeric(num), "from10(" + num + ", ...): not a number!");
    Lib.assert(isNumeric(to),  "from10(..., " + to + "): not a number!");

    return num.toString(to);
}

/**
 * Tries to guess the radix of data.num, and removes prefixes if any. Defaults to 10 if it
 * fails to guess. Hold down shift to force the guess to be 10.
 *
 * @param  {string} nstr - The number the radix should be deduced from
 * @return {int} - The guessed radix
 */
function guessBase(nstr) {
    Lib.assert(typeof nstr == "string", "guessBase(nstr): not an string!");

    if (!LaunchBar.options.shiftKey) {
        if (nstr.search(/[g-z]+/) != -1) {
            return 36;
        }
        else if (nstr.search(/[a-f]+/) != -1) {
            return 16;
        }
        else if (nstr.search(/^[0-1., ]+$/) != -1) {
            return 2;
        }
    }
    return 10;
}

/**
 * Tests whether n is numeric or not (as a string or number).
 *
 * @private
 * @param  {string|number} n - The value to test
 * @return {bool} - Whether n is numeric or not
 */
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
