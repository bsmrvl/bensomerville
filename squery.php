<?php

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
    $obj = $result -> fetch_object();
    echo json_encode($obj);
    $result -> free_result();
}
  
$conn -> close();

?>