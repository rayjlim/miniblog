<?php
namespace controllers;

defined('ABSPATH') or exit('No direct script access allowed');

use \Lpt\DevHelp;
use \Lpt\Logger;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use \Exception;

/**
 *   This class will handle the Create, Update, Delete Functionality
 *   for the Images uploaded
 */
class UploadHandler
{
    public $resource = null;

    public function __construct($resource)
    {
        $this->resource = $resource;
    }

    public function upload()
    {
        return function (Request $request, Response $response, $args) {

            DevHelp::debugMsg('upload' . __FILE__);

            // $filePath = $_POST["filePath"] . DIR_SEP ?? date(YEAR_MONTH_FORMAT); // not allowing user to specify path
            $filePath = date(YEAR_MONTH_FORMAT);
            $targetDir = $_ENV['UPLOAD_DIR'] . DIR_SEP . $filePath;
            $urlFileName = strtolower(preg_replace('/\s+/', '_', trim(basename($_FILES["fileToUpload"]["name"]))));
            $targetFileFullPath = $targetDir . DIR_SEP . $urlFileName;

            $imageFileType = strtolower(pathinfo($targetFileFullPath, PATHINFO_EXTENSION));
            $validFileExt = array("jpg", "png", "jpeg", "gif");
            $createdDir = false;

            try {
                $check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
                if ($check == false) {
                    throw new Exception("File is not an image");
                }

                // Check if directory already exists
                if (!file_exists($targetDir)) {
                    $createdDir = true;
                    mkdir($targetDir, 0711);
                }

                if (file_exists($targetFileFullPath)) {
                    throw new Exception(" file already exists." . "![](../uploads/"
                    . $filePath . $urlFileName . ")");
                }

                // Check file size
                if ($_FILES["fileToUpload"]["size"] > UPLOAD_SIZE_LIMIT) {
                    throw new Exception("Sorry, your file is too large."
                    . $_FILES["fileToUpload"]["size"] . ' of ' . UPLOAD_SIZE_LIMIT);
                }
                // Allow certain file formats
                if (!in_array($imageFileType, $validFileExt)) {
                    throw new Exception("only JPG, JPEG, PNG & GIF files are allowed");
                }

                if (!move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $targetFileFullPath)) {
                    throw new Exception("Sorry, there was an error moving upload file");
                }
                chmod($targetFileFullPath, 0755);
                $data = [];
                $data['fileName'] = $urlFileName;
                $data['filePath'] = $filePath;
                $data['createdDir'] = $createdDir;
                Logger::log('File Uploaded: ' . $filePath . " - " . $urlFileName);
                echo json_encode($data);
                return $response;
            } catch (Exception $e) {
                http_response_code(500);
                echo 'Caught exception: ', $e->getMessage(), $targetDir, '\n';
                echo 'targetFileFullPath: ', $targetFileFullPath, '\n';
            }
        };
    }

    public function resize()
    {
        return function (Request $request, Response $response, $args) {
            DevHelp::debugMsg('resizeImage' . __FILE__);
            //375 x 667 (iphone 7)
            $fileName = $_GET["fileName"];
            $filePath = $_GET["filePath"];

            $targetDir = $_ENV['UPLOAD_DIR'] . DIR_SEP . $filePath;
            $fileFullPath = $targetDir . DIR_SEP . $fileName;

            $new_width = $_ENV['IMG_RESIZE_WIDTH'];

            $this->resizer($new_width, $fileFullPath, $fileFullPath);

            $urlFileName = $fileName;
            $data = [];
            $data['fileName'] = $urlFileName;
            $data['filePath'] = $filePath;
            Logger::log('File Resized: ' . $filePath . " - " . $urlFileName);
            echo json_encode($data);
            return $response;
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
        return function (Request $request, Response $response, $args) {
            DevHelp::debugMsg('rotateImage' . __FILE__);

            $fileName = $_GET["fileName"];
            $filePath = $_GET["filePath"];

            // File and rotation
            $targetDir = $_ENV['UPLOAD_DIR'] . DIR_SEP . $filePath;
            $targetFile = $targetDir . DIR_SEP . $fileName;
            $info = getimagesize($targetFile);
            $mime = $info['mime'];
            switch ($mime) {
                case 'image/jpeg':
                    $image_create_func = 'imagecreatefromjpeg';
                    $image_save_func = 'imagejpeg';
                    // $new_image_ext = 'jpg';
                    break;

                case 'image/png':
                    $image_create_func = 'imagecreatefrompng';
                    $image_save_func = 'imagepng';
                    // $new_image_ext = 'png';
                    break;

                case 'image/gif':
                    $image_create_func = 'imagecreatefromgif';
                    $image_save_func = 'imagegif';
                    // $new_image_ext = 'gif';
                    break;

                default:
                    throw new Exception('Unknown image type.');
            }

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
            $data = [];
            $data['fileName'] = $fileName;
            $data['filePath'] = $filePath;
            Logger::log('File Rotated: ' . $filePath . " - " . $fileName);
            echo json_encode($data);
            return $response;
        };
    }

    public function rename()
    {
        return function (Request $request, Response $response, $args) {
            DevHelp::debugMsg('rename' . __FILE__);

            $request = $this->app->request();
            $entry = json_decode($request->getBody());

            $fileName = $entry->fileName;
            $filePath = $entry->filePath;
            $newFileName = $entry->newFileName;

            $targetDir = $_ENV['UPLOAD_DIR'] . DIR_SEP . $filePath;
            rename($targetDir . DIR_SEP . $fileName, $targetDir . DIR_SEP . $newFileName);
            $data = [];
            $data['fileName'] = $newFileName;
            $data['filePath'] = $filePath;
            Logger::log('File Renamed: ' . $filePath . " - " . $fileName . " to " . $newFileName);
            echo json_encode($data);
            return $response;
        };
    }

    public function listMedia()
    {
        return function (Request $request, Response $response, $args) {

            DevHelp::debugMsg('start listMedia');
            $currentDir = isset($args['currentDir']) ? $args['currentDir'] : '';
            $filelist = preg_grep('/^([^.])/', scandir($_ENV['UPLOAD_DIR']. DIR_SEP));

            DevHelp::debugMsg('currentDir ' . $currentDir);
            DevHelp::debugMsg('end($filelist)' . is_dir($_ENV['UPLOAD_DIR'] . DIR_SEP . end($filelist)));

            //h no media in root folder, get from last
            if (count($filelist) > 0 && $currentDir == ''  && is_dir($_ENV['UPLOAD_DIR'] . DIR_SEP . end($filelist))) {
                DevHelp::debugMsg('reading first file');
                $currentDir = end($filelist);
            }

            DevHelp::debugMsg('$currentDir: ' . $currentDir);
            $dirContent = preg_grep('/^([^.])/', scandir($_ENV['UPLOAD_DIR'] . DIR_SEP . $currentDir));
            $data = [];
            $data['currentDir'] = $currentDir;
            $data['uploadDirs'] = $filelist;
            $data['dirContent'] = $currentDir !== '' ? $dirContent : []; // do not list root dir

            echo json_encode($data);
            return $response;
        };
    }

    public function deleteMedia()
    {
        return function (Request $request, Response $response, $args) {
            DevHelp::debugMsg('delete media');
            $fileName = $_GET["fileName"];
            $filePath = $_GET["filePath"];
            DevHelp::debugMsg('$fileName' . $fileName);
            DevHelp::debugMsg('$filePath' . $filePath);

            $this->resource->removefile($_ENV['UPLOAD_DIR'] . DIR_SEP . $filePath . DIR_SEP . $fileName);
            $data = [];
            $data['pageMessage'] = 'File Removed: ' . $filePath . DIR_SEP . $fileName;
            Logger::log('File Removed: ' . $filePath . DIR_SEP . $fileName);
            echo json_encode($data);
            return $response;
        };
    }
}
