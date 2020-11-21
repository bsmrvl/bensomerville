<?php

header("Content-Type: text/event-stream");
header("Cache-Control: no-cache");
header("Access-Control-Allow-Origin: *");

if(file_get_contents('e.txt')=='t'){
    echo "data: " . 'on' . "\n\n";


    // $c = file_get_contents('r.txt');
    // if($c == 'f'){
    //     echo "data: " . 'on' . "\n\n";
    // } 
    // else {
    //     echo "data: " . 'off' . "\n\n";
    // }
    $sdf = fopen('e.txt','w');
    fwrite($sdf, 'f');
    fclose($sdf);
}

?>