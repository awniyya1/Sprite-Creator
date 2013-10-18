<?php

// We're putting all our files in a directory called images.
$uploaddir = 'uploads/';
$input = file_get_contents('php://input');
$ins = preg_split('/\r\n/',$input);
$name = $ins[1];
$name = explode(";",$name);
$nam = explode("=",$name[2]);
$fname = ereg_replace('"', "", $nam[1]); 

// Encode it correctly

$encodedData = str_replace(' ','+',$ins[4]);
$decodedData = base64_decode($encodedData);

if(file_put_contents($uploaddir.$fname, $decodedData)) {
	echo $fname.":uploaded successfully";
}
else {
	// Show an error message should something go wrong.
	echo "Something went wrong. Check that the file isn't corrupted";
}


?>