# miniblog

miniblog relies on phpcurl; if FB login is not working look if the module is enabled in the xampp php config

## Dependency

Using Slim ver 2.4 because it works with php5.4 (which is available on godaddy shared hosting). I would like to upgrade to Slim 3 or 4 but ran into issues with `.htaccess` not working when I set the php version to 5.6.

## Setup

see basic setup in link below

    * php.ini
        * uncomment
            * extension=php_curl.dll
            * extension=php_mbstring.dll
        * composer needs openssl extension
            * extension=php_openssl.dll

        set timezone date.timezone = "America/Los_Angeles"

    for JS/React
       install webpack globally

[dropbox link](https://paper.dropbox.com/doc/Project-notes-To-remember-Aqk90sy9YHyVkkxkMuqaZ)

    Basic Setup - Composer
    Deploying to Production
    for file to be included in composer autoload
    Unit Tests - Codeception
    Jasmine - JS tests
    Setting up grunt to run Jasmine tests
    Grunt can watch for js or tests changes
    php testing: Codeception setup & running

Unit Tests for JS tesingg

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
(in linux terminal)
php directory: /opt/lampp/bin
    [http://localhost/projects/miniblog3/index.php/](http://localhost/projects/miniblog3/index.php/)

 node_modules/.bin/webpack -w (for development)
 npm run build
 npm run build-prod
 
 running composer
 /opt/lampp/bin/php /usr/local/bin/composer install


 sql setup required:
 SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));