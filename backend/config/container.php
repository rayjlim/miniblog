<?php

use DI\Container;
use Psr\Container\ContainerInterface;
use Slim\App;
use Slim\Factory\AppFactory;
use \App\dao\DAOFactory;

return [
    'settings' => function () {
        return require __DIR__ . '/settings.php';
    },

    App::class => function (ContainerInterface $container) {
        $container = new Container();
        AppFactory::setContainer($container);
        $app = AppFactory::createFromContainer($container);

        // Register routes
        (require __DIR__ . '/../routes.php')($app);

        // Register middleware
        // (require __DIR__ . '/middleware.php')($app);

        $container->set('Objfactory', function () {
            return new \App\helpers\DependFactory();
        });

        return $app;
    },
];
