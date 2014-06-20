#!/usr/bin/env php
<?php

$items = array();

array_shift($argv);
foreach ($argv as $arg) {
    $item = array();
    $item['title'] = trim(strip_tags($arg));
    $item['actionArgument'] = $item['title'];
    $items[] = $item;
}

echo json_encode($items);
