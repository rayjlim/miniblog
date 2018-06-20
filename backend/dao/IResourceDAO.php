<?php
/**
* IResourceDAO.class.php
*
* PHP Version 5.4
*
* @date     2007-11-28
* @category Personal
* @package  Lpt
* @author   Raymond Lim <rayjlim1@gmail.com>
* @license  lilplaytime http://www.lilplaytime.com
* @link     www.lilplaytime.com
* 
*/
/**
* Intreface IResourceDAO
*
* @date     2007-11-28
* @category Personal
* @package  Lpt
* @author   Raymond Lim <rayjlim1@gmail.com>
* @license  lilplaytime http://www.lilplaytime.com
* @link     www.lilplaytime.com
*/  
interface IResourceDAO
{
    function setSession($key, $value);
    function getSession($key);
    function issetSession($key);
    function destroySession();
    function setCookie($key, $value, $expiration);
    function writeFile($filename, $fileData);
    function readdir($logDirectory);
    function readfile($logfile);
    function removefile($logfile);
    function getDateTime();
    /**
     * Content from URL
     *
     * @param string $url site url
     *
     * @return site content 
     */
    function load($url);
    function sendEmail($email, $subject, $message);
    function shortCodes();

    function echoOut ($output);
}