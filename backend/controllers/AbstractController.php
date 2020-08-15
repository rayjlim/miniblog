<?php
defined('ABSPATH') or exit('No direct script access allowed');

abstract class AbstractController
{
    public $app = null;

    public function __construct($app)
    {
        $this->app = $app;
    }
}
