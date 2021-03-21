<?php

/** Connects to MySQL database, selects data from given query string, and echos as JSON.
*/

$conn = new mysqli(
    "127.0.0.1",
    getenv('MYSQL_USER'),
    getenv('MYSQL_PW'),
    getenv('MYSQL_DB')
);

if ($conn -> connect_errno) {
    echo "Failed to connect to MySQL: " . $mysqli -> connect_error;
    exit();
}

$qry = $_POST['q'];

if ($result = $conn -> query($qry)) {
    while ($row = $result -> fetch_assoc()) {
        $all[] = $row;
    }
    echo json_encode($all);
    $result -> free_result();
}
  
$conn -> close();

?>