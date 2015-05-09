#!/usr/bin/env php
<?php

$html = @mb_convert_encoding($argv[1], "UTF-8", "HTML-ENTITIES");

echo json_encode([
    [
     "title" => $html,
     "subtitle" => "HTML Entities",
     "actionArgument" => $html,
     "icon" => "html" . (empty($html) ? "_d" : "")
    ]
]);
