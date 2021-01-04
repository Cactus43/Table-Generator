<?php
		include_once("open.php");
    
//example query
	$queryU="SELECT id, nickname, nome, cognome, img FROM `user`";

$resultU= mysqli_query($db, $queryU);

$end = array();

while($sql = mysqli_fetch_array($resultU, MYSQLI_ASSOC)){

//adding a null values to test how the tables print them
	$sql["check"]=null;
	array_push($end, $sql);
}

	mysqli_close($db);
	
	echo json_encode($end);
?>
