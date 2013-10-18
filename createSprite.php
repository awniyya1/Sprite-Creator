<?php

class spritify
{
	//image type to save as (for possible future modifications)
	private $image_type = "png";
	//array to contain images and image informations
	private $images = array();
	//array for errors
	private $errors = array();
	
	//gets errors
	public function get_errors(){
		return $this->errors;
	}
	
	/*
	 * adds new image
	 * first parameter - path to image file like ./images/image.png
	 * second parameter (optiona) - ID of element fro css code generation
	 */
	public function add_image($image_path, $id="elem"){
		if(file_exists($image_path))
		{
			$info = getimagesize($image_path);
			if(is_array($info))
			{
				$new = sizeof($this->images);
				$this->images[$new]["path"] = $image_path;
				$this->images[$new]["width"] = $info[0];
				$this->images[$new]["height"] = $info[1];
				$this->images[$new]["mime"] = $info["mime"];
				$type = explode("/", $info['mime']);
				$this->images[$new]["type"] = $type[1];
				$this->images[$new]["id"] = $id;
			}
			else
			{
				$this->errors[] = "Provided file \"".$image_path."\" isn't correct image format";
			}
		}
		else
		{
			$this->errors[] = "Provided file \"".$image_path."\" doesn't exist";
		}
	}
	
		//creates sprite image resource
	private function create_image($cssData){
		$cWidth = $cssData["canvas"]["width"];
		$cHeight = $cssData["canvas"]["height"];
		$total = array("width" => intval($cWidth), "height" => intval($cHeight));
		$sprite = imagecreatetruecolor($total["width"], $total["height"]);
		imagesavealpha($sprite, true);
		$transparent = imagecolorallocatealpha($sprite, 0, 0, 0, 127);
		imagefill($sprite, 0, 0, $transparent);
		
		foreach($this->images as $image)
		{
			$func = "imagecreatefrom".$image['type'];
			$img = $func($image["path"]);
			$bgSize = explode(" ", $cssData[$image["id"]]["background-size"]);
			$bgPos = explode(" ", $cssData[$image["id"]]["background-position"]);
			$thumb = imagecreatetruecolor(intval($bgSize[0]), intval($bgSize[1]));
			imagecopyresized($thumb, $img, 0, 0, 0, 0, intval($bgSize[0]), intval($bgSize[1]), $image["width"], $image["height"]);
			imagecopy( $sprite, $thumb, intval($bgPos[1])*(-1), intval($bgPos[0])*(-1), 0, 0,  intval($bgSize[0]), intval($bgSize[1]));
			ImageDestroy($thumb);
		}
		imagepng($sprite, 'output/css_sprite.png');
		$finalCss = array_splice($cssData,0,count($cssData)-1);
		$this->generate_css($finalCss);
		return $sprite;
	}
	
	//outputs image to browser (makes php file behave like image)
	public function output_image($cssData){
		$sprite = $this->create_image($cssData);
		ImageDestroy($sprite);
	}
	
	/*
	 * generates css code from the provided css data
	 */
	public function generate_css($cssData){
		$finalData ='';
		foreach($cssData as $key=>$value)
		{
			$finalData .= '.' . $key . '{'."\n";
			$finalData .= 'background-image:url(../images/css_sprite.png);'."\n";
			foreach($value as $sKey=>$val){
				$finalData .= $sKey.':'.$val .';'."\n";
			}
			$finalData .='}'."\n";
		}
		file_put_contents('output/styles.css', $finalData);
	}
	
	

}
?>