<?php
namespace App\dao;

defined('ABSPATH') or exit('No direct script access allowed');
use \DateTime;

class Resource implements IResourceDAO
{
    /**
     * setSession
     *
     * @param string $key site url
     *
     * @return void
     */
    public function setSession($key, $value)
    {
        if (session_id() == '') {
            session_start();            // session isn't started
        }
        $_SESSION[$key] = $value;
    }

    /**
     * getSession
     *
     * @param  string $key reference
     * @return mixed value
     */
    public function getSession($key)
    {
        return array_key_exists($key, $_SESSION) ? $_SESSION[$key] : null;
    }

    /**
     * @return bool
     */
    public function issetSession($key)
    {
        return isset($_SESSION[$key]);
    }

    /**
     * @return void
     */
    public function setCookie($key, $value, $expiration)
    {
        setcookie($key, $value, $expiration);
    }

    /**
     * @return void
     */
    public function destroySession()
    {
        session_destroy();
    }

    /**
     * @return void
     */
    public function writeFile(string $filename, string $content)
    {
        $filehandler = fopen($filename, 'a') or die("can't open file");
        fwrite($filehandler, $content);
        fclose($filehandler);
    }

    /**
     * @return string[]
     *
     * @psalm-return array<int<0, max>, string>
     */
    public function readdir($logDirectory)
    {
        $filelist = [];
        $handle = opendir($logDirectory);

        while (false !== ($file = readdir($handle))) {
            if ($file != "." && $file != ".." && $file != ".svn") {
                $filelist[] = $file;
            }
        }
        closedir($handle);

        asort($filelist);
        // $filelist2 = [];
        // foreach ($filelist as $key => $val) {
        //     $filelist2[] = $val;
        // }
        return $filelist;
    }

    /**
     * @return false|string
     */
    public function readfile($logfile)
    {
        $myFile = $logfile;
        $fh = fopen($myFile, 'r');
        $fileContents = fread($fh, filesize($myFile));

        fclose($fh);
        return $fileContents;
    }

    /**
     * @return void
     */
    public function removefile($logfile)
    {
        $myFile = $logfile;
        unlink($myFile);
    }

    /**
     * @return DateTime
     */
    public function getDateTime()
    {
        return new DateTime();
    }

    /**
     * @return void
     */
    public function getDateByDescription(string $strDescription){
        date(YEAR_MONTH_DAY_FORMAT, strtotime($strDescription));
    }

    /**
     * @return void
     */
    public function sendEmail($email, $subject, $message)
    {
        mail($email, $subject, $message);
    }

    /**
     * @return string|true
     */
    public function load($url)
    {
        //echo 'url loadings: '.$url;
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_HEADER, false);

        //curl_setopt($curl, CURLOPT_HTTPHEADER, array("Accept: application/json"));
        $response = curl_exec($curl);
        if ($response === false) {
            die("Curl failed: " . curl_error($curl));
        }

        curl_close($curl);
        return $response;
    }

    /**
     * @return void
     */
    public function echoOut($output)
    {
        echo $output;
    }
}
