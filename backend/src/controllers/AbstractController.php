<?php
namespace App\controllers;

defined('ABSPATH') or exit('No direct script access allowed');

abstract class AbstractController
{
    protected $app;
    public function __construct($app)
    {
        $this->app = $app;
    }
}
