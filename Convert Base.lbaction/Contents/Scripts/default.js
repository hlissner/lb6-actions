include("shared/lib/lib.js");
include("shared/lib/notify.js");

function runWithString(string) {
    // Easy access to preferences and bug reporting if Command is pressed.
    if (LaunchBar.options.commandKey) {
        Lib.Notify.force_prompt();
        return [];
    }

    try {
	    var data = parse(string);

        // Convert it to intermediary radix (base 10)
        var result = from10(to10(data.num, data.from), data.to);

        // Formatted result
        var formatted_result = format(result, data.to);

        return [
            {
                title: formatted_result,
                subtitle: "Result",
                label: "Base " + data.to
            },
            formatted_result != result ? {
                title: result,
                subtitle: "Unformatted result",
                label: "Base " + data.to
            } : {},
            {
                title: format(data.num, data.from),
                subtitle: "From",
                label: "Base " + data.from + (data.guessed ? " (guessed)" : "")
            }
        ];
    } catch (err) {
	    Lib.Notify.error(err);
        return [];
    }
}

/**
 * Format a number with commas (or spaces with binary) as appropriate.
 *
 * @param {string} nstr - The number string to be formatted
 * @param {int} base - The base nstr is in
 * @param {int} [from] - The base nstr was in (only relevant when base is 2)
 * @return {string} - The formatted number
 */
function format(nstr, base, from) {
    Lib.assert(typeof nstr == "string", "format(" + nstr + ", ...): not a string!");
    Lib.assert(isNumeric(base), "format(..., " + base + "): not a number!");

    if (base == 2 && from != 2) {
        var log = Math.log2(from);
        if (log != parseInt(log)) {
            log = 4;
        }
        return nstr.replace(new RegExp("\B(?=(\d{" + log + "})+(?!\d))", "gi"), " ");
    } else {
        return nstr.replace(/\B(?=(\d{3})+(?!\d))/gi, ",");
    }
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

    parts = string.split(" ");
    if (parts.length == 1) {
        parts[1] = 10;
    }

    var data = {
        num:  parts[0].toLowerCase(),
        to:   parseInt(parts[1]),
        from: 10,
        guessed: true
    };
    data.num  = data.num.replace(",", "");

    if (data.num.indexOf("_") != -1) {
        var _num = data.num.split("_");
        data.num = _num[0];
        data.from = parseInt(_num[1]);
        data.guessed = false;
    } else {
        data.from = guessBase(data.num);
    }

    if (data.from < 2 || data.from > 36 || data.to < 2 || data.to > 36) {
        throw "Invalid radix; this converter only supports 2 <= r <= 36";
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
        else if (nstr.search(/[^2-9a-zA-Z,._]+/) != -1) {
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
