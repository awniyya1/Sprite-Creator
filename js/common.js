var common = {
	row : 0,
	preR : -1,
	gImgN : '',
	gImgR : 0,
	gImgH : 0,
	gImgT : 0,
	gImgL : 0,
	gWid : 25,
	gHei : 25,
};
var cssData = {}, dataArray = [];


/*
Function Name : processFiles
Arguments : file object
Description:
This method reads the file and places the image in the image object created at runtime and invokes the positionImages method to place the image on the available space on the droppable area
*/
var processFiles = function (file) {
	var reader = new FileReader();
	reader.onload = function (e) {
		var image = new Image();
		image.onload = function (e) {
			var fName = file.name.split('.')[0];
			positionImages(image, fName);
		}
		image.src = e.target.result;
		dataArray.push({name : file.name, value :e.target.result});
	}
	reader.readAsDataURL(file);
}

/*
Function Name : positionImages
Arguments : image object and name of the file dropped
Description:
This method invokes the setIMagePos method to actually position the images on the container
*/
var positionImages = function(image,fName){
	var container = $("#droppable");
	var lastIns = $("#droppable div.ui-draggable").last();
	setImagePos(fName, lastIns, image, container);
	
}

/*
Function Name : setImagePos
Arguments : Image name, Last included image object, current image object, container
Description:
This method will check for the space available for the image dropped to be placed on the container. If the container contains images already, then it will check for the recently inserted image and places the new image next to it with respect to the space available. Every images will be placed on the horizontal direction. If the first row's space is used up then it will be placed in the next row.
*/
var setImagePos = function(fName, lastIns, cImage, container){
	var newImgLeft = 0,newImgTop = 0;
	var lastImg = {
		top : 0,
		left : 0,
		width : 0,
		height : 0,
	};
	var curImg = {
		width : parseInt(cImage.width,10),
		height : parseInt(cImage.height,10),
	};
	var contNer = {
		contW : parseInt(container.css("width"),10),
		contH : parseInt(container.css("height"),10),
		top : parseInt(container.position().top, 10),
		left : parseInt(container.position().left, 10),
	};
		
	if(lastIns.length){
		lastImg.left = parseInt(lastIns.position().left, 10);
		lastImg.top = parseInt(lastIns.position().top, 10);
		lastImg.width = parseInt(lastIns.css("width"),10);
		lastImg.height = parseInt(lastIns.css("height"),10);
	
		if(((lastImg.left+lastImg.width)+curImg.width <= contNer.left+contNer.contW)){
			if(lastImg.left === 0){
				newImgLeft += common.gWid;
				while(newImgLeft < lastImg.width) {
					newImgLeft+=common.gWid;
				}
			} else if((lastImg.left + lastImg.width) % common.gWid === 0) {
				newImgLeft = lastImg.left + lastImg.width;
			} else {
				newImgLeft = lastImg.left + common.gWid;
				while(newImgLeft < (lastImg.left + lastImg.width)) {
					newImgLeft += common.gWid;
				}
			}
			newImgTop = lastImg.top;
			/*newImgLeft = lastImg.left+lastImg.width;
			newImgTop = lastImg.top;*/
		} else{
			newImgTop = lastImg.top + lastImg.height;
			newImgLeft = 0;
			common.row++;
			common.preR++;
			if(common.row == common.gImgR+1){
				newImgTop = common.gImgT+common.gImgH;
			}
			if(newImgTop % common.gWid !== 0){
				var midVal = newImgTop % common.gWid;
				newImgTop = (newImgTop - midVal) + common.gWid;
			}
		}
	}
	if(newImgTop+cImage.height < contNer.contH){
		container.append("<div id='"+fName+"Helper' class='placeHol' imgname='"+fName+"'><img imgname='"+fName+"' id='"+fName+"' src='" + cImage.src+ "'/></div>");
				
				$('#'+fName+"Helper").css("position","absolute")
				.draggable({
					containment : "parent",
					cursor : "move",
					obstacle : ".placeHol",
					preventCollision: true,
					snap :false,
					snapMode : "both",
					zIndex : 100,
					grid : [(common.gWid * 1), (common.gHei * 1)],
					drag : function(event, ui){
						var statBar = $('#statsFoot');
						statBar.html('Name: '+$(this)[0].attributes["imgname"].nodeValue+', Width : '+$(this)[0].children[0].width+'px, Height : '+$(this)[0].children[0].height+'px, posX : -'+Math.round(ui.position.left)+', posY : -'+Math.round(ui.position.top));
					},
					start :function(event, ui){
						$(this).removeClass('placeHol');
						$('#statsFoot').show();
					},
					stop : function(event, ui){
						$(this).addClass('placeHol');
						var uiTop = Math.round(ui.position.top), 
						uiLeft = Math.round(ui.position.left), objKey = ($(this)[0].id).split('Helper')[0];
						cssData[objKey]["background-position"] = ((uiTop!=0)?"-"+uiTop+"px":uiTop+"px")+" "+((uiLeft!=0)?"-"+uiLeft+"px":uiLeft+"px");
						refreshData(objKey, uiTop, uiLeft, 1);
						$('#statsFoot').hide();
					},
				})
				.on('dblclick', function (event) {
					var keyVal = ($(this)[0].id).split('Helper')[0];
					delete cssData[keyVal];
					$.each(dataArray, function(i){
						if((dataArray[i].name).split('.')[0] === keyVal) {
							dataArray.splice(i,1);
							return false;
						}
					});
					$('#'+keyVal+'_css').remove();
					$(this).remove();
					$('#statsFoot').hide();
				})
				.mouseover(function(){
					$(this).addClass('ui-borderLine')
						   .css("cursor","move")
						   .css("zIndex", 101);
					var keyVal = (($(this)[0].id).split('Helper')[0]) + "_css";
					$('#'+keyVal).addClass('cssHov');
					$('#'+keyVal+'_del').css('display', 'inline');
					var statBar = $('#statsFoot');
						statBar.html(' Name: '+$(this)[0].attributes["imgname"].nodeValue+', Width : '+$(this)[0].children[0].width+'px, Height : '+$(this)[0].children[0].height+'px, posX : -'+$(this).position().left+'px, posY : -'+$(this).position().top+'px ');
					$('#statsFoot').show();
				})
				.mouseout(function(){
					$(this).removeClass('ui-borderLine')
						   .css("zIndex", 100);
					var keyVal = (($(this)[0].id).split('Helper')[0]) + "_css";
					$('#'+keyVal).removeClass('cssHov');
					$('#'+keyVal+'_del').css('display', 'none');
					$('#statsFoot').hide();
				});
		
		if(cImage.height >= common.gImgH){
			common.gImgN = fName;
			common.gImgH = cImage.height;
			common.gImgR = common.row;
			common.gImgT = newImgTop;
			common.gImgL = newImgLeft;
		}
		var imgObj = $('#'+fName+'Helper');
		imgObj.css("top", newImgTop)
					.css("left", newImgLeft);
		
		constructCss(fName, imgObj.position().top, imgObj.position().left, cImage.width, cImage.height);
	} else {
		$('#errorMessage').html("Image Doesn't fit the canvas please adjust the images for fitting in the new images")
		.dialog({
			dialogClass : "alert",
			title : "Alert !",
			width : 400,
			height : 250,
			modal : true,
			buttons : [{
				text : "OK",
				click : function(){
					$(this).dialog("close");
				}
			}]
		});
	}
}

/*
Function Name : constructCss
Arguments : image name, top position, left position, width and height
Description :
This method is used for constructing the css data and it is displayed in the css data container.
*/
var constructCss = function(imgName, iTop, iLeft, iWidth, iHeight){
	var cssDiv = $("#cssDetails");
	cssData[imgName] = {
		"background-position" : ((iTop!=0)?"-"+iTop+"px":iTop+"px")+" "+((iLeft!=0)?"-"+iLeft+"px":iLeft+"px"),
		width : iWidth+"px",
		height : iHeight+"px",
		"background-size" : iWidth+"px "+iHeight+"px",
	};
	
	cssDiv.append("<div class='node' id='"+imgName+"_css'><span id='"+imgName+"_css_del' class='delImg ui-icon ui-icon-circle-close'></span>.<span class='title'>"+imgName+"</span>{<div class='pair'><span class='key'>background-position</span>: <span id='"+imgName+"Bg'>"+cssData[imgName]['background-position']+"</span>;</div><div class='pair'><span class='key'>background-size</span>: <span id='"+imgName+"Bgs'>"+cssData[imgName]['background-size']+"</span>;</div><div class='pair'><span class='key'>width</span>: <span id='"+imgName+"Wd'>"+cssData[imgName].width+"</span>;</div><div class='pair'><span class='key'>height</span>: <span id='"+imgName+"Ht'>"+cssData[imgName].height+"</span>;</div>}</div>");
	
	$('#'+imgName+'_css').on('mouseover', function (event) {
		var selImage = ($(this)[0].id).split('_css')[0]+'Helper';
		$('#'+selImage).trigger('mouseover');
	})
	.on('mouseout', function (event) {
		var selImage = ($(this)[0].id).split('_css')[0]+'Helper';
		$('#'+selImage).trigger('mouseout');
	});
	$('#'+imgName+'_css_del').on('click', function (e) {
		var selImage = ($(this)[0].id).split('_css_del')[0]+'Helper';
		$('#'+selImage).trigger('dblclick');
	})
	
}

/*
Function Name : refreshData
Arguments : Id of the image object dragged
Description :
This function will update the current position of the dragged image in the css data container.
*/
var refreshData = function(image, top, left, flag){
	if(flag === 1){
		$('#'+image+'Bg').html(cssData[image]['background-position']);
		if(common.gImgN == image){
			common.gImgT = top;
			common.gImgL = left;
		}
	} else if(flag === 2){
		$('#'+image+'Bgs').html(cssData[image]['background-size']);
		if(common.gImgN == image){
			common.gImgH = left;
		}
	}
}

/*
Function Name : upload
Arguments : NA
Description :
This function will upload the files that are loaded in to the canvas for generating the sprites.
*/
var upload = function() {
		
		$("#loading").show();
		var totalPercent = 100 / dataArray.length;
		var x = 0;		
		$('#loading-content').html('Uploading '+dataArray[0].name);
		
		$.each(dataArray, function(index, file) {	
			$.ajax({
				type : "PUT",
				url : "upload.php",
				contentType : "multipart/form-data; boundary=---------------------------afuspritecreator",
				data : constructData(dataArray[index],"---------------------------afuspritecreator")
			})
			.done(function(data){
				var fileName = dataArray[index].name;
				++x;
				
				// Change the bar to represent how much has loaded
				$('#loading-bar .loading-color').css({'width' : totalPercent*(x)+'%'});
				
				if(totalPercent*(x) == 100) {
					// Show the upload is complete
					$('#loading-content').html('Uploading Complete!');
					
					// Reset everything when the loading is completed
					setTimeout(restartFiles, 500);
					
				} else if(totalPercent*(x) < 100) {
				
					// Show that the files are uploading
					$('#loading-content').html('Uploading '+fileName);
				
				}
				if(index == dataArray.length-1)
					getGeneratedSprite();
			});
		});
		
		return false;
};

var restartFiles = function() {
	
		// This is to set the loading bar back to its default state
		$('#loading-bar .loading-color').css({'width' : '0%'});
		$('#loading').css({'display' : 'none'});
		$('#loading-content').html(' ');		
		return false;
}

/*
Function Name : getGeneratedSprite
Arguments : NA
Description :
This function will post the css data of the files uploaded and it will finally generates the links for downloading the Sprite images and the css file.
*/
var getGeneratedSprite = function() {
	cssData["canvas"] = {
		width : $('#droppable').css("width"),
		height : $('#droppable').css("height"), 
	}
	$.ajax({
		type : "POST",
		url : "getSprite.php",
		data : {"cssData":JSON.stringify(cssData)},
		success : function(data){
			$('#errorMessage').html(data)
		.dialog({
			dialogClass : "alert",
			title : "Alert !",
			width : 400,
			height : 250,
			modal : true,
			buttons : [{
				text : "OK",
				click : function(){
					$(this).dialog("close");
				}
			}]
		});
		},
		error : function(xhr, status, error){
			console.log('Error::'+error);
		}
	});
	
}

/*
Function Name : constructData
Arguments : data and boundary value
Description : 
This function will generate the data in the format of multipart data type with the boundary separated values. The multipart encode type format is choosen because the image files should be properly submitted without any data loss.
*/
var constructData = function(data, boundary){
	var actData = boundary+'\r\n';
	var nType = data.name.split('.');
	var val = data.value.split(',');
	actData+= 'Content-Disposition: form-data; name="'+nType[0]+'"; filename="'+data.name+'"\r\nContent-Type: '+(val[0].split(';')[0]).split(':')[1]+'\r\n\r\n';
	actData+= val[1]+'\r\n';
	actData+= boundary+'--\r\n';
	return actData;
}

/*
This method is used for initializing the event listeners
*/
$(document).ready(function () {
	$('#droppable').on('drop', function (e) {
		e.preventDefault();
		$('#overLay').hide();
		var files = e.originalEvent.dataTransfer.files, i;
		for (i = 0; i < files.length; i++) {
			processFiles(files[i]);
			
		}
		return false;
	})
	
	$('#droppable').resizable();
	$('#cssDetails').draggable();
	
	$('#droppable').on('dragover', function(e) {
		$('#overLay').show();
		if (e.stopPropagation) { e.stopPropagation(); } // The if checks are excessive but safest
		if (e.preventDefault) { e.preventDefault(); }
	})
	.on('click', function (e) {
		if(e.target != this){
			return true;
		}
		var inData = "<div>Width: <input type='text' id='canWidth' size='5'/> px Height: <input type='text' id='canHeight' size='5'/> px</div>";
		$('#errorMessage').html(inData)
		.dialog({
			dialogClass : "alert",
			title : "Specify Grid Size",
			width : 400,
			height : 150,
			modal : true,
			buttons : [{
				text : "Done",
				click : function(){
					var cWid = parseInt($('#canWidth').val(), 10), cHei = parseInt($('#canHeight').val(), 10);
					common.gWid = (cWid ? cWid : 0);
					common.gHei = (cHei ? cHei : 0);
					$(this).dialog("close");
				}
			}]
		});
	});
	$('#uploadButton').on('click', upload);
	$("input[name=gridSize]:radio").on('change', function (e) {
		$('#droppable').css('background-image', 'url(images/grid-'+$(this).val()+'.png)');
		common.gHei = common.gWid = $(this).val() * 1;
		
	});
});