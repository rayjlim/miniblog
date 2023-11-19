<?php
function getValue($array, $key)
{
    return $array[$key] ?? false;
}
function getExportValues($item)
{
    return $item->export();
}
