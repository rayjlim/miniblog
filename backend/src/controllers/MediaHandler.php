<?php

namespace App\controllers;

defined('ABSPATH') or exit('No direct script access allowed');

use App\core\DevHelp;
use App\core\Logger;
use Psr\Container\ContainerInterface;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class MediaHandler
{
    private ContainerInterface $container;
    private ?object $resource = null;
    private string $uploadDir;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
        $this->uploadDir = $_ENV['UPLOAD_DIR'];
    }

    private function getFullPath(string $dir, string $file = ''): string
    {
        return $this->uploadDir . DIR_SEP . $dir . ($file ? DIR_SEP . $file : '');
    }

    private function getFilesOrderedByDate(string $dir): array
    {
        $dirPath = $this->getFullPath($dir);
        if (!is_dir($dirPath)) {
            return [];
        }
        
        $files = scandir($dirPath);
        $files = array_filter($files, function($file) use ($dir) {
            return !str_starts_with($file, '.') &&
                   is_file($this->getFullPath($dir, $file));
        });

        $fullPaths = array_map(function($file) use ($dir) {
            return [
                'name' => $file,
                'time' => filemtime($this->getFullPath($dir, $file))
            ];
        }, array_values($files));

        usort($fullPaths, fn($a, $b) => $b['time'] - $a['time']);
        return array_column($fullPaths, 'name');
    }

    public function listMedia(Request $request, Response $response, array $args): Response
    {
        $currentDir = $args['currentDir'] ?? '';
        $directories = preg_grep('/^([^.])/', scandir($this->uploadDir));

        if (empty($currentDir) && !empty($directories)) {
            $lastDir = end($directories);
            if (is_dir($this->getFullPath($lastDir))) {
                $currentDir = $lastDir;
            }
        }

        $reply = (object)[
            'currentDir' => $currentDir,
            'uploadDirs' => $directories,
            'dirContent' => $currentDir ? $this->getFilesOrderedByDate($currentDir) : []
        ];

        $response->getBody()->write(json_encode($reply));
        return $response;
    }

    public function mediaInfo(Request $request, Response $response): Response
    {
        $params = $request->getQueryParams();
        $targetFile = $this->getFullPath($params['filePath'], $params['fileName']);
        $imageFileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));

        // Extract EXIF data
        $exifData = [];
        if ($imageFileType !== 'png' && $imageFileType !== 'gif') {
            $exif = @exif_read_data($targetFile);
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

        $reply = (object)[
            'fileName' => $params['fileName'],
            'filePath' => $params['filePath'],
            'info' => getimagesize($targetFile),
            'fileSize' => filesize($targetFile),
            'exif' => $exifData
        ];

        $response->getBody()->write(json_encode($reply));
        return $response;
    }

    public function deleteMedia(Request $request, Response $response): Response
    {
        if (!$this->resource) {
            $factory = $this->container->get('Objfactory');
            $this->resource = $factory->makeResource();
        }

        $params = $request->getQueryParams();
        $targetFile = $this->getFullPath($params['filePath'], $params['fileName']);

        $this->resource->removefile($targetFile);
        $message = "File Removed: {$params['filePath']}" . DIR_SEP . $params['fileName'];
        Logger::log($message);

        $response->getBody()->write(json_encode(['pageMessage' => $message]));
        return $response;
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
