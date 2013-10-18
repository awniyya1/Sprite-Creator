Sprite-Creator
==============

The Sprite-Creator is that which takes in the dropped images on the canvas and allows us to resize the images and to position the images on the canvas where do we think the image to be appeared on the sprite. On placing the images it will simultaneously displays the corresponding css datas with respect to the canvas layer. The images do not overlap each other while dragging. You can also drop in multiple image files at a time, which will be placed in the canvas one after the other. After placing the images and on clicking the button at the top right corner of the screening containing the text "Generate Sprite" will give you the output in a dialog box containing two links to download the generated sprite inmage and the css file for the sprite image.

The css file will contain the style properties for all the files defined under the class name. The class name is got from the name of the image. For example if the name of the file is "saw.jpg" then its corresponding css class name would be ".saw".

The output sprite image would in the format of png.

Libraries used
==============
Jquery UI

Plugins Used
============
Jquery Ui draggable collision
