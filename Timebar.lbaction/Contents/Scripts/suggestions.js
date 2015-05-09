function runWithString(string) {
    var data= [
        {title: "stop", subtitle: "Stop Timebar's timer"},
        {title: "version", subtitle: "The version of TimeBar and its CLI tool"}
    ];
    
    if (string.trim() === "")
        return data;
    
    return data.filter(function(item) {
        return item.title.indexOf(string.toLowerCase()) !== -1;
    });
}
