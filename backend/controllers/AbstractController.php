<?php
namespace controllers;

defined('ABSPATH') or exit('No direct script access allowed');

abstract class AbstractController
{
    public function __construct($app)
    {
        $this->app = $app;
    }
}
