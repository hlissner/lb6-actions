#!/usr/bin/env php
<?php

$items = array();

array_shift($argv);
foreach ($argv as $arg) {
    $item = array();
    $item['title'] = htmlentities($arg, ENT_QUOTES);
    $item['actionArgument'] = $item['title'];
    $items[] = $item;
}

echo json_encode($items);
