#!/usr/bin/env php
<?php

// And quick'n'dirty script to parse, reduce and prepare the data.json file. This
// will only need to be run once every time the cache expires.

// argv[1] => the data.json file
// argv[2] => where to save the search index file

// error_reporting(0);

$data = json_decode(file_get_contents($argv[1]));

$output = array();
foreach ($data->data as $key => $val) {
    $output[] = array(
        // Remove newlines, tags and HTML encoded entities from notes and description
        "id" => urlencode($key),
        "title" => $val->title,
        "notes" => sanitize($val->notes),
        "description" => sanitize($val->description),
        "status" => $val->status,
        "links" => $val->links,
        "categories" => $val->categories
    );
}

echo json_encode($output);

////////

function sanitize($input) {
    // PHP has inbuilt html_entity_decode and strip_tags functionality.
    // It saves time to simply rely on PHP once in a while, than to
    // reinvent the wheel in JS.
    $input = strip_tags($input);
    $input = str_replace("&mdash;", "-", html_entity_decode($input));
    return trim($input);
}
