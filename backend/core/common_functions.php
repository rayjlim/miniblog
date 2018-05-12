<?php
function getValue($array, $key) {
    if (!isset($array[$key])) {
        return false;
    }
    return $array[$key];
}
function getExportValues($item) {
    return $item->export();
}
