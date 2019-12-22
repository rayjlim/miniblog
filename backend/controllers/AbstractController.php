<?php
abstract class AbstractController
{
    public $app = null;
    
    public function __construct($app)
    {
        $this->app = $app;
    }
}
