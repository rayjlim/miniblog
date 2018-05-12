<?php
abstract class AbstractController
{
    var $app = null;
    
    function __construct($app) {
        $this->app = $app;
    }
}