function runWithString(string) {
    return [
        { title: decodeURIComponent(string) }
    ];
}

function runWithPaths(paths) {
    var items = [];
    for (var i in paths) {
        items.push(runWithString(paths[i])[0]);
    }
    return items;
}

function runWithItem(item) {
    return runWithString(item.title);
}
