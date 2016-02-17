include("api.js");

function runWithString(string) {
    try {
        if (string.trim().length === 0) {
            return [
                {title: "<number>[[_<source-radix>] <dest-radix>]", icon: "Caution"}
            ];
        }
        var data = parse(string.trim());
        return (data.to == null ? [2, 8, 10, 16] : [data.to]).map(function(r) {
            return evaluate(data.num, data.from, r, true);
        });
    } catch (err) {
        return [
            {title: "Invalid Input: " + err, icon: "Caution"},
            {title: "Usage: <number>[[_<source-radix>] <dest-radix>]", icon: "CalendarEventPriority"}
        ];
    }
}

