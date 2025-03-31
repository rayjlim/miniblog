<?php

namespace App\controllers;

defined('ABSPATH') or exit('No direct script access allowed');

use App\core\DevHelp;
use App\core\Logger;
use Psr\Container\ContainerInterface;
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
    private $container = null;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    public function upload(Request $request, Response $response, $args)
    {
        DevHelp::debugMsg('upload' . __FILE__);

        // $filePath = $_POST["filePath"] . DIR_SEP ?? date(YEAR_MONTH_FORMAT); // not allowing user to specify path
        $filePath = date(YEAR_MONTH_FORMAT);
        $targetDir = $_ENV['UPLOAD_DIR'] . DIR_SEP . $filePath;

        // TODO: validate file upload exists
        $urlFileName = strtolower(preg_replace('/\s+/', '_', trim(basename($_FILES["fileToUpload"]["name"]))));
        $targetFileFullPath = $targetDir . DIR_SEP . $urlFileName;

        $imageFileType = strtolower(pathinfo($targetFileFullPath, PATHINFO_EXTENSION));
        $validFileExt = ["jpg", "png", "jpeg", "gif"];
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

            // Extract EXIF data
            $exifData = [];
            if ($imageFileType !== 'png' && $imageFileType !== 'gif') {
                $exif = @exif_read_data($targetFileFullPath);
                if ($exif !== false) {
                    $exifData = [
                        'datetime' => $exif['DateTimeOriginal'] ?? $exif['DateTime'] ?? '',
                        'make' => $exif['Make'] ?? '',
                        'model' => $exif['Model'] ?? '',
                        'exposure' => $exif['ExposureTime'] ?? '',
                        'aperture' => $exif['COMPUTED']['ApertureFNumber'] ?? '',
                        'iso' => $exif['ISOSpeedRatings'] ?? '',
                        'focal_length' => $exif['FocalLength'] ?? '',
                        'gps' => [
                            'latitude' => $this->getGPSCoordinate($exif, 'GPSLatitude', 'GPSLatitudeRef'),
                            'longitude' => $this->getGPSCoordinate($exif, 'GPSLongitude', 'GPSLongitudeRef')
                        ]
                    ];
                }
            }

            $reply = new \stdClass();
            $reply->fileName = $urlFileName;
            $reply->filePath = $filePath;
            $reply->createdDir = $createdDir;
            $reply->filesize = filesize($targetFileFullPath);
            $reply->exif = $exifData;

            Logger::log('File Uploaded: ' . $filePath . " - " . $urlFileName);
            $response->getBody()->write(json_encode($reply));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (Exception $e) {
            http_response_code(500);
            echo 'Caught exception: ', $e->getMessage(), $targetDir, '\n';
            echo 'targetFileFullPath: ', $targetFileFullPath, '\n';
        }
    }

    public function resize(Request $request, Response $response)
    {
        DevHelp::debugMsg('resizeImage' . __FILE__);
        //375 x 667 (iphone 7)
        $fileName = $_GET["fileName"];
        $filePath = $_GET["filePath"];

        $targetDir = $_ENV['UPLOAD_DIR'] . DIR_SEP . $filePath;
        $fileFullPath = $targetDir . DIR_SEP . $fileName;

        $newWidth = $_ENV['IMG_RESIZE_WIDTH'];

        $this->resizer($newWidth, $fileFullPath, $fileFullPath);

        $reply = new \stdClass();
        $reply->fileName = $fileName;
        $reply->filePath = $filePath;
        $reply->size = filesize($fileFullPath);

        Logger::log('File Resized: ' . $filePath . " - " . $fileName);
        $response->getBody()->write(json_encode($reply));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function resizer($newWidth, $targetFile, $originalFile)
    {
        $info = getimagesize($originalFile);
        $mime = $info['mime'];
        if ($info[0] <= $newWidth) return;

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

    public function rotate(Request $request, Response $response, $args)
    {
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

        // Free the memory
        imagedestroy($img);
        imagedestroy($rotated);

        $reply = new \stdClass();
        $reply->fileName = $fileName;
        $reply->filePath = $filePath;
        $reply->size = filesize($targetFile);

        Logger::log('File Rotated: ' . $filePath . " - " . $fileName);
        $response->getBody()->write(json_encode($reply));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function rename(Request $request, Response $response, $args)
    {
        DevHelp::debugMsg('rename' . __FILE__);
        $entry = json_decode($request->getBody());

        $fileName = $entry->fileName;
        $filePath = $entry->filePath;
        $newFileName = $entry->newFileName;

        $targetDir = $_ENV['UPLOAD_DIR'] . DIR_SEP . $filePath;
        rename($targetDir . DIR_SEP . $fileName, $targetDir . DIR_SEP . $newFileName);

        $reply = new \stdClass();
        $reply->fileName = $newFileName;
        $reply->filePath = $filePath;
        Logger::log('File Renamed: ' . $filePath . " - " . $fileName . " to " . $newFileName);
        $response->getBody()->write(json_encode($reply));
        return $response->withHeader('Content-Type', 'application/json');
    }

    private function getGPSCoordinate($exif, $coord, $ref)
    {
        if (!isset($exif[$coord]) || !isset($exif[$ref])) {
            return null;
        }

        $degrees = $this->convertGPSToDecimal($exif[$coord]);
        $ref = $exif[$ref];

        if ($ref == 'S' || $ref == 'W') {
            $degrees = -$degrees;
        }

        return $degrees;
    }

    private function convertGPSToDecimal($coordParts)
    {
        if (!is_array($coordParts)) {
            return 0;
        }

        $degrees = count($coordParts) > 0 ? $this->convertToDecimal($coordParts[0]) : 0;
        $minutes = count($coordParts) > 1 ? $this->convertToDecimal($coordParts[1]) : 0;
        $seconds = count($coordParts) > 2 ? $this->convertToDecimal($coordParts[2]) : 0;

        return $degrees + ($minutes / 60) + ($seconds / 3600);
    }

    private function convertToDecimal($ratio)
    {
        if (strpos($ratio, '/') !== false) {
            list($num, $den) = explode('/', $ratio);
            return $den == 0 ? 0 : ($num / $den);
        }
        return floatval($ratio);
    }
}
