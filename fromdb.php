<?php

// function utf8ize($d) {
//     if(is_object($d))
//         foreach ($d as $k => $v) 
//             $d->$k = utf8ize($v);
//      else 
//         return utf8_encode($d);
//     return $d;
// }

$id = $_POST['id'];
$tab = $_POST['tab'];

$conn = new mysqli(
    "localhost",
    "smrvl_gen",
    "MpPRL^vVUZyR",
    "smrvl_main"
);

if ($conn -> connect_errno) {
    echo "Failed to connect to MySQL: " . $mysqli -> connect_error;
    exit();
}

$qry = "SELECT * FROM {$tab} WHERE tid = \"{$id}\";";

if ($result = $conn -> query($qry)) {
    while ($row = $result -> fetch_assoc()) {
        // $all[] = $row;
        echo $row;
    }
    // $all = $result -> fetch_all();
    // echo $all;
    // $obj = $result -> fetch_object();
    // echo json_encode($obj);
    $result -> free_result();
}
  
$conn -> close();

?>