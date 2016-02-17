include("shared/lib/notify.js");
include("api.js");

function runWithString(string) {
    // Easy access to preferences and bug reporting if Command is pressed.
    if (LaunchBar.options.commandKey) {
        Lib.Notify.force_prompt();
        return [];
    }

    try {
        var data = parse(string.trim());

        return (data.to == null ? [2, 8, 10, 16] : [data.to]).map(function(r) {
            return evaluate(data.num, data.from, r);
        }).concat([
            {
                title: format(data.num, data.from),
                subtitle: "Source",
                label: "Base " + data.from + (data.guessed ? " (guessed)" : ""),
                icon: "IdenticallyNamedTracksTemplate"
            }
        ]);
    } catch (err) {
	    Lib.Notify.error(err);
        return [];
    }
}
