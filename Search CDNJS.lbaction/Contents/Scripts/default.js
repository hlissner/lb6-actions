/*global DATA,Lib*/

include("api.js");

function runWithString(string) {
    try {
        return DATA.select(string);
    } catch (err) {
        Lib.Notify.error(err);
    }
}
