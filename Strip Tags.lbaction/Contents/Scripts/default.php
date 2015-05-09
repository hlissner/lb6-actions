#!/usr/bin/env php
<?php

$items = array();

array_shift($argv);
foreach ($argv as $arg) {
    $title = trim(strip_tags($arg));
    $items[] = array(
        'title' => $title,
        'actionArgument' => $title
    );
}

echo json_encode($items);
