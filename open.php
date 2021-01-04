<?php
		$host ='host_name';
		$user ='root_name';
		$password='';
		$database='db_name';
		$db=mysqli_connect($host,$user) or die("not connected");
		mysqli_select_db($db,$database) or die("no database");
?>
