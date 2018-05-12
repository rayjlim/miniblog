# miniblog

smsblog relies on phpcurl; if FB login is not working look if the module is enabled in the xampp php config

Setup
-----

    see basic setup in link below  


    php.ini
        uncomment
            extension=php_curl.dll
            extension=php_mbstring.dll
        composer needs openssl extension
            extension=php_openssl.dll


        set timezone date.timezone = "America/Los_Angeles"

	for JS/React
		install webpack globally

http://nimb.ws/YRF4AD

    Basic Setup - Composer
    Deploying to Production
    for file to be included in composer autoload
    Unit Tests - Codeception
    Jasmine - JS tests
    Setting up grunt to run Jasmine tests
    Grunt can watch for js or tests changes
    php testing: Codeception setup & running

Unit Tests

    just run grunt

    or

    grunt watchsingle --phpsingletarget=parsers/LongUrlParser


special handling:
in fullcalendar.css, line 625.
commented out .fc-content {word-wrap:nowrap}
so the events display multi line instead of forced to one line


----
using node ver. 7.2.1

++ start linux dev server
sudo /opt/lampp/lampp start
php directory: /opt/lampp/bin
http://localhost/projects/smsblog/index.php/

 node_modules/.bin/webpack -w (for development)
 node_modules/.bin/webpack --config webpack-prod.config.js


 running composer
 /opt/lampp/bin/php /usr/local/bin/composer install