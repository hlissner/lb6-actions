#!/usr/bin/env php
<?php

// Handles HTML characters and entities
$html = @htmlspecialchars($argv[1], ENT_NOQUOTES | ENT_HTML5);
// Handles unicode/foreign characters
$html = @mb_convert_encoding($html, 'HTML-ENTITIES', "UTF-8");

echo json_encode([
    [
     "title" => $html,
     "actionArgument" => $html,
     "icon" => "html" . (empty($html) ? "_d" : "")
    ]
]);
