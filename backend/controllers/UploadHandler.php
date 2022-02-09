<?php
defined('ABSPATH') or exit('No direct script access allowed');

use \Lpt\DevHelp;

/**
 *   This class will handle the Create, Update, Delete Functionality
 *   for the Images uploaded
 */
class UploadHandler extends AbstractController
{
    public $resource = null;

    public function __construct($app, $resource)
    {
        $this->resource = $resource;
        parent::__construct($app);
    }

    public function redirector($url)
    {
        header("Location: $url");
        echo "<head><meta http-equiv=\"refresh\" content=\"0; url=$url\"></head>";
        echo "<a href=\"$url\">media page</a>";
    }

    public function upload()
    {
        return function () {
            DevHelp::debugMsg('upload' . __FILE__);

            $filePath = $_POST["filePath"] . '/' ?? date("Y-m");
            $targetDir = UPLOAD_DIR . $filePath;
            $urlFileName = strtolower(preg_replace('/\s+/', '_', trim(basename($_FILES["fileToUpload"]["name"]))));
            $targetFileFullPath = UPLOAD_DIR . $filePath . $urlFileName;

            $imageFileType = strtolower(pathinfo($targetFileFullPath, PATHINFO_EXTENSION));
            $validFileExt = array("jpg", "png", "jpeg", "gif");
            $createdDir = false;

            try {

                // TODO: Check if image file is a actual image or fake image
                $check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
                if ($check == false) {
                    throw new Exception("File is not an image.");
                }

                // Check if directory already exists
                if (!file_exists($targetDir)) {
                    $createdDir = true;
                    mkdir($targetDir, 0711);
                }

                // Check if file already exists
                if (file_exists($targetFileFullPath)) {
                    throw new Exception(" file already exists." . "![](../uploads/" . $filePath . $urlFileName . ")" . ' of ' . UPLOAD_SIZE_LIMIT);
                }

                // Check file size
                if ($_FILES["fileToUpload"]["size"] > UPLOAD_SIZE_LIMIT) {
                    throw new Exception("Sorry, your file is too large." . $_FILES["fileToUpload"]["size"] . ' of ' . UPLOAD_SIZE_LIMIT);
                }
                // Allow certain file formats
                if (!in_array($imageFileType, $validFileExt)) {
                    throw new Exception("only JPG, JPEG, PNG & GIF files are allowed.");
                }

                if (!move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $targetFileFullPath)) {
                    throw new Exception("Sorry, there was an error moving upload file.");
                }

                $data['fileName'] = $urlFileName;
                $data['filePath'] = $filePath;
                $data['createdDir'] = $createdDir;

                echo json_encode($data);
                return;
            } catch (Exception $e) {
                header('HTTP/1.1 500 Internal Server Error');
                echo 'Caught exception: ', $e->getMessage(), $targetDir, '\n';
                echo 'targetFileFullPath: ', $targetFileFullPath, '\n';
            }
        };
    }

    public function resize()
    {
        return function () {
            DevHelp::debugMsg('resizeImage' . __FILE__);
            $new_width = 0;
            $new_height = 0;

            //375 x 667 (iphone 7)
            $fileName = $_GET["fileName"];
            $filePath = $_GET["filePath"];

            $targetDir = UPLOAD_DIR . $filePath;
            $fileFullPath = $targetDir . $fileName;

            $new_width = 360;

            $this->resizer($new_width, $fileFullPath, $fileFullPath);

            $urlFileName = $fileName;

            $data['fileName'] = $urlFileName;
            $data['filePath'] = $filePath;
            echo json_encode($data);
        };
    }

    public function resizer($newWidth, $targetFile, $originalFile)
    {
        $info = getimagesize($originalFile);
        $mime = $info['mime'];

        switch ($mime) {
            case 'image/jpeg':
                $image_create_func = 'imagecreatefromjpeg';
                $image_save_func = 'imagejpeg';
                break;

            case 'image/png':
                $image_create_func = 'imagecreatefrompng';
                $image_save_func = 'imagepng';
                break;

            case 'image/gif':
                $image_create_func = 'imagecreatefromgif';
                $image_save_func = 'imagegif';
                break;

            default:
                throw new Exception('Unknown image type.');
        }

        $img = $image_create_func($originalFile);
        list($width, $height) = getimagesize($originalFile);

        $newHeight = ($height / $width) * $newWidth;
        $tmp = imagecreatetruecolor($newWidth, $newHeight);
        imagecopyresampled($tmp, $img, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);

        if (file_exists($targetFile)) {
            unlink($targetFile);
        }
        $image_save_func($tmp, "$targetFile");
    }

    public function rotate()
    {
        return function () {
            DevHelp::debugMsg('rotateImage' . __FILE__);

            $fileName = $_GET["fileName"];
            $filePath = $_GET["filePath"];

            // File and rotation

            $targetDir = UPLOAD_DIR . $filePath;
            $targetFile = $targetDir . $fileName;
            $info = getimagesize($targetFile);
            $mime = $info['mime'];
            switch ($mime) {
                case 'image/jpeg':
                    $image_create_func = 'imagecreatefromjpeg';
                    $image_save_func = 'imagejpeg';
                    $new_image_ext = 'jpg';
                    break;

                case 'image/png':
                    $image_create_func = 'imagecreatefrompng';
                    $image_save_func = 'imagepng';
                    $new_image_ext = 'png';
                    break;

                case 'image/gif':
                    $image_create_func = 'imagecreatefromgif';
                    $image_save_func = 'imagegif';
                    $new_image_ext = 'gif';
                    break;

                default:
                    throw new Exception('Unknown image type.');
            }
            $fileExtension = '.' . $new_image_ext;

            $degrees = isset($_GET["left"]) ? 90 : -90;
            $img = $image_create_func($targetFile);
            $rotated = imagerotate($img, $degrees, 0);

            if (file_exists($targetFile)) {
                unlink($targetFile);
            }
            $image_save_func($rotated, "$targetFile");
            //$permissionChanged = chmod($newFileFullName, 0777);

            // Free the memory
            imagedestroy($img);
            imagedestroy($rotated);

            $data['fileName'] = $fileName;
            $data['filePath'] = $filePath;
            echo json_encode($data);
        };
    }

    public function rename()
    {
        return function () {
            DevHelp::debugMsg('rename' . __FILE__);

            $request = $this->app->request();
            $entry = json_decode($request->getBody());

            $fileName = $entry->fileName;
            $filePath = $entry->filePath;
            $newFileName = $entry->newFileName;

            $targetDir = UPLOAD_DIR . $filePath;
            rename($targetDir . $fileName, $targetDir . $newFileName);

            $data['fileName'] = $newFileName;
            $data['filePath'] = $filePath;
            echo json_encode($data);
        };
    }

    public function listMedia()
    {
        return function ($currentDir = '') {
            \Lpt\DevHelp::debugMsg('start listMedia');
            $currentDir = $currentDir != '' ? $currentDir : '';
            $filelist = preg_grep('/^([^.])/', scandir(UPLOAD_DIR));
            // \Lpt\DevHelp::debugMsg(print_r($filelist));

            \Lpt\DevHelp::debugMsg('currentDir ' . $currentDir);
            \Lpt\DevHelp::debugMsg('end($filelist)' . is_dir(UPLOAD_DIR . DIR_SEP . end($filelist)));

            //h no media in root folder, get from last
            if (count($filelist) > 0 && $currentDir == ''  && is_dir(UPLOAD_DIR . DIR_SEP . end($filelist))) {
                \Lpt\DevHelp::debugMsg('reading first file');
                $currentDir = end($filelist);
            }

            // TODO VALIDATE LOGNAME PASSED IS IN CORRECT FORMAT (PREFIX____.TXT)
            $dirContent = '';

            \Lpt\DevHelp::debugMsg('$currentDir: ' . $currentDir);
            $dirContent = preg_grep('/^([^.])/', scandir(UPLOAD_DIR . DIR_SEP . $currentDir));

            // usort($dirContent, function($a, $b){
            //     return filemtime($a) > filemtime($b);
            // });

            $data['uploadDirs'] = $filelist;
            $data['currentDir'] = $currentDir;
            $data['dirContent'] = $dirContent;

            echo json_encode($data);
        };
    }

    public function deleteMedia()
    {
        return function () {
            DevHelp::debugMsg('delete media');
            $fileName = $_GET["fileName"];
            $filePath = $_GET["filePath"];
            DevHelp::debugMsg('$fileName' . $fileName);
            DevHelp::debugMsg('$filePath' . $filePath);

            $this->resource->removefile(UPLOAD_DIR . $filePath . DIR_SEP . $fileName);

            $data['pageMessage'] = 'File Removed: ' . $filePath . DIR_SEP . $fileName;

            echo json_encode($data);
        };
    }
}
