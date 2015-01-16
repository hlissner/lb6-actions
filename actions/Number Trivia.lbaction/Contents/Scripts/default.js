include('shared/notify.js');
include('shared/request.js');

var API_URL = "http://numbersapi.com";

function run() { get("random"); }
function runWithString(string) { get(string); }

function get(cmd) {
    try {
        var text = Lib.Request.getJSON(API_URL + "/" + cmd + "?json").text.wrap(50);
        LaunchBar.displayInLargeType({title: "Number Trivia", string: text});
    } catch (err) {
        Lib.Notify.error(err);
    }
}
