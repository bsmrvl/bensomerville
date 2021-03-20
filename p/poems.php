<html>
    <meta name="robots" content="noindex, follow">

    <meta charset="utf-8" http-equiv="Content-Type"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <link rel="stylesheet" type="text/css" href="/css/main.min.css" />

    <div class="noJS">

    <h2><a href="/">BEN SOMERVILLE</a></h2>
</html>

<?php

    $dir = scandir('./poem-/');

    foreach ($dir as $one){
        echo "<a href='poem-/".substr($one, 0, -5)."'>".substr($one, 0, -5)."</a><br>";
    }
    echo "</div>";

?>