<?php

/** Echos html contents of requested page from p/ directory.
*/


if(!$_POST['page']) die("0");

$page = $_POST['page'];

if(file_exists('p/'.$page.'.html')){
    echo file_get_contents('p/'.$page.'.html');
} else {
    echo 'There is no such page!';
}

?>
