<?php
	$cssData = json_decode($_POST['cssData'], true);
	include 'createSprite.php';
	$sprite = new spritify();
	$res = '';
	$dir = 'uploads';
	
	if (is_dir($dir)) {
		if ($dh = opendir($dir)) {
			while (($file = readdir($dh)) !== false) {
				if( "." == $file || ".." == $file ){
				continue;
			}
				$getMime = explode('.', $file);
				$sprite->add_image('uploads/'.$file, $getMime[0]);
				$res = $res. "filename: .".$file."<br />";
			}
			closedir($dh);
		}
	}

$arr = $sprite->get_errors();
//if there are any then output them
if(!empty($arr))
{
	foreach($arr as $error)
	{
		echo "<p>".$error."</p>";
	}
}
else
{
	var_dump($cssData);
	$sprite->output_image($cssData);	
	echo '<a href="download.php?file=css_sprite.png" target="_blank">Click Here for Sprite</a><br/><a href="download.php?file=styles.css" target="_blank">Click Here for Css</a>';
	
	 
	// Open the directory
	$dirHandle = opendir($dir);
	// Loop over all of the files in the folder
	while ($file = readdir($dirHandle)) {
		// If $file is NOT a directory remove it
		if(!is_dir($file)) {
			unlink ("$dir"."/"."$file"); // unlink() deletes the files
		}
	}
	// Close the directory
	closedir($dirHandle);

}

?>