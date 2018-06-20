<?php
use \Lpt\DevHelp;

define ("UPLOAD_SIZE_LIMIT", 5 * 1000000); // 5 meg
define ("UPLOAD_DIR", ABSPATH . "uploads/");

/**
 *   This class will handle the Create, Update, Delete Functionality
 *   for the Entrys
 */
class UploadHandler extends AbstractController
{
    var $resource = null;

    function __construct($app, $resource) {
        $this->resource = $resource;
        parent::__construct($app);
    }
    
    function form() {
        return function (){
        $this->app->view()->appendData(["page_title" => 'Upload Picture']);
        
        $this->app->render('upload_form.twig');
        };
    }
    function view() {
        return function (){
                
        $this->app->view()->appendData(["fileName" => $_GET["fileName"]]);
        $this->app->view()->appendData(["filePath" => $_GET["filePath"]]);
        $this->app->view()->appendData(["page_title" => 'View Upload']);
        
        $this->app->render('upload_viewer.twig');
        };
    }

    function redirector($url){
        header("Location: $url");
        echo "<head><meta http-equiv=\"refresh\" content=\"0; url=$url\"></head>";
        echo "<a href=\"$url\">media page</a>";
    }

    function upload() {
        return function () {
            DevHelp::debugMsg('upload' . __FILE__);

            $filePath = $_POST["filePath"].'/';
            $targetDir = UPLOAD_DIR . $filePath;

            $targetFileFullPath = UPLOAD_DIR . $filePath. basename($_FILES["fileToUpload"]["name"]);

            $uploadOk = 1;
            $imageFileType = strtolower(pathinfo($targetFileFullPath, PATHINFO_EXTENSION));
            $validFileExt = array("jpg", "png", "jpeg", "gif");
            // Check if image file is a actual image or fake image
            if(isset($_POST["submit"])) {
                $check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
                if($check !== false) {
                    //echo "File is an image - " . $check["mime"] . ".";
                    $uploadOk = 1;
                } else {
                    echo "File is not an image.";
                    $uploadOk = 0;
                }
            }

            // Check if file already exists
            if (!file_exists($targetDir)) {
                echo "Creating directory.";
                mkdir($targetDir, 0711);
            }

            // Check if file already exists
            if (file_exists($targetFileFullPath)) {
                echo "Sorry, file already exists. <br>";
                $urlFileName = basename($_FILES["fileToUpload"]["name"]);
                echo "![](../uploads/". $filePath.$urlFileName.")";
                echo "<br><br><a href=\"../main#/oneDay\">One Day</a>";
                $uploadOk = 0;
            }

            // Check file size
            if ($_FILES["fileToUpload"]["size"] > UPLOAD_SIZE_LIMIT) {
                echo "Sorry, your file is too large." . $_FILES["fileToUpload"]["size"]. ' of '. UPLOAD_SIZE_LIMIT;
                $uploadOk = 0;
            }
            // Allow certain file formats
            if (! in_array($imageFileType, $validFileExt))  {
                echo "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
                $uploadOk = 0;
            }
            // Check if $uploadOk is set to 0 by an error
            if ($uploadOk == 0) {
                echo "<br>Sorry, your file was not uploaded.";
                // if everything is ok, try to upload file
            } else {
                if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $targetFileFullPath)) {
                    // echo "The file ". basename( $_FILES["fileToUpload"]["name"]). " has been uploaded.";
                } else {
                    echo "Sorry, there was an error uploading your file.";
                }

                $urlFileName = basename($_FILES["fileToUpload"]["name"]);
                $this->redirector('../uploadResize/?fileName='.$urlFileName.'&filePath='.$filePath);
            }
        };
    }
    
    function resize() {
        return function () {
            DevHelp::debugMsg('resizeImage' . __FILE__);
            $new_width = 0;
            $new_height = 0;

            //375 x 667 (iphone 7)
            $fileName = $_GET["fileName"];
            $filePath = $_GET["filePath"];

            $targetDir = ABSPATH . "uploads/".$filePath;
            $fileFullPath = $targetDir . $fileName;

            $new_width = 360;
            
            $this->resizer($new_width, $fileFullPath, $fileFullPath);
            
            $urlFileName = $fileName;
            
            if(isset($_GET["api"])) {
                $data['fileName'] = $urlFileName;
                $data['filePath'] = $filePath;
                echo json_encode($data);
            }else{
            $this->redirector('../main#/uploadViewer?fileName='.$urlFileName.'&filePath='.$filePath);
            }
        };
    }

    function resizer($newWidth, $targetFile, $originalFile) {

        $info = getimagesize($originalFile);
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
    
    function rotate() {
        return function () {
            DevHelp::debugMsg('rotateImage' . __FILE__);

            $fileName = $_GET["fileName"];
            $filePath = $_GET["filePath"];

            // File and rotation

            $targetDir = ABSPATH . "uploads/".$filePath;
            $targetFile = $targetDir.$fileName;
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

            $degrees = isset($_GET["left"]) ? 90 : -90 ;
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
             
            if(isset($_GET["api"])) {
                $data['fileName'] = $fileName;
                $data['filePath'] = $filePath;
                echo json_encode($data);
            }else{
                $this->redirector('../main#/uploadViewer?fileName='.$fileName.'&filePath='.$filePath);
            }
        };
    }

    function rename() {
        return function () {
            DevHelp::debugMsg('rename' . __FILE__);

            $request = $this->app->request();
            $entry = json_decode($request->getBody());

            $fileName = $entry->fileName;
            $filePath = $entry->filePath;
            $newFileName = $entry->newFileName;

            $targetDir = ABSPATH . "uploads/".$filePath;
            rename($targetDir.$fileName,  $targetDir.$newFileName);
            $urlFileName = $newFileName;
            
            $data['fileName'] = $newFileName;
            $data['filePath'] = $filePath;
            echo json_encode($data);
            
        };
    }

    public function listMedia() {
        return function ($currentDir='') {
            \Lpt\DevHelp::debugMsg('start listMedia');
            $currentDir = $currentDir != '' ? $currentDir : '';
            $filelist = preg_grep('/^([^.])/', scandir(UPLOAD_DIR));

            if (count($filelist) > 0 && $currentDir == '') {
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
        
        $this->app->view()->appendData(["uploadDirs" => $filelist]);
        $this->app->view()->appendData(["currentDir" => $currentDir]);
        $this->app->view()->appendData(["dirContent" => $dirContent]);
        $this->app->render('media_list.twig');
        };
    }
    
    public function deleteMedia() {
        return function () {
            DevHelp::debugMsg('delete media');
            $fileName = $_GET["fileName"];
            $filePath = $_GET["filePath"];
            DevHelp::debugMsg('$fileName' . $fileName);
            DevHelp::debugMsg('$filePath' . $filePath);
            

             $this->resource->removefile(UPLOAD_DIR . DIR_SEP . $filePath. DIR_SEP . $fileName);
            
             $data['pageMessage'] = 'File Removed: ' . $filePath. DIR_SEP . $fileName;
            
            
            //forward to xhr_action
            $_SESSION['page_message'] = $data['pageMessage'];
            
            if ($this->app->request()->isAjax()) {
                echo json_encode($data);
            } 
            else {
                DevHelp::redirectHelper($baseurl . 'media/');
            }
        };
    }
  
}

