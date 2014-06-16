#!/usr/bin/env php
<?php

$items = array();

array_shift($argv);
foreach ($argv as $arg) {
    $item = array();
    $item['title'] = html_entity_decode($arg, ENT_QUOTES);
    $item['actionArgument'] = $item['title'];
    $items[] = $item;
}

echo json_encode($items);
