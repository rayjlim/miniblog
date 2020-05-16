<?php
defined('ABSPATH') OR exit('No direct script access allowed');

class Resource implements IResourceDAO
{
    /**
     * setSession
     *
     * @param string $key site url
     * @return none
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
     * @param string $key    reference
     * @return mixed value
     */
    public function getSession($key)
    {
        return array_key_exists($key, $_SESSION) ? $_SESSION[$key] : null;
    }
    
    public function issetSession($key)
    {
        return isset($_SESSION[$key]);
    }

    public function setCookie($key, $value, $expiration)
    {
        setcookie($key, $value, $expiration);
    }

    public function destroySession()
    {
        session_destroy();
    }
    
    public function writeFile($filename, $content)
    {
        $filehandler = fopen($filename, 'a') or die("can't open file");
        fwrite($filehandler, $content);
        fclose($filehandler);
    }
    
    public function readdir($logDirectory)
    {
        $filelist = array();
        if ($handle = opendir($logDirectory)) {
            while (false !== ($file = readdir($handle))) {
                if ($file != "." && $file != ".." && $file != ".svn") {
                    array_push($filelist, $file);
                }
            }
            closedir($handle);
        }
        
        asort($filelist);
        $filelist2 = array();
        foreach ($filelist as $key => $val) {
            array_push($filelist2, $val);
        }
        return $filelist;
    }
    
    public function readfile($logfile)
    {
        $myFile = $logfile;
        $fh = fopen($myFile, 'r');
        $fileContents = fread($fh, filesize($myFile));
        
        fclose($fh);
        return $fileContents;
    }
    
    public function removefile($logfile)
    {
        $myFile = $logfile;
        unlink($myFile);
    }
    
    public function getDateTime()
    {
        return new DateTime();
    }
    
    public function sendEmail($email, $subject, $message)
    {
        mail($email, $subject, $message);
    }

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
    
    public function echoOut($output)
    {
        echo $output;
    }
}
