#!/usr/bin/env php
<?php

error_reporting(0);

$html = @mb_convert_encoding($argv[1], 'HTML-ENTITIES', "UTF-8");

echo json_encode([
    [
     "title" => $html,
     "subtitle" => "HTML Entities",
     "actionArgument" => $html,
     "icon" => "html" . (empty($html) ? "_d" : "")
    ]
]);
