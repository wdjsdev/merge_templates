/*
	Component Name: get_artboard_bounds
	Author: William Dowling
	Creation Date: 25 September, 2017
	Description: 
		obtain the bounds of the first artboard in the given document
		and return the width and height as an object
	Arguments
		document object
	Return value
		object containing the width and height of the artboard

*/

function getArtboardBounds(doc)
{
	log.h("getArtboardBounds(" + doc.name + ")");
	var aB = doc.artboards[0];
	var rect = aB.artboardRect;
	log.l("Source document artboard bounds = {w:" + rect[2]-rect[0] + ",h:" + rect[3]-rect[1] + "}");
	return {"w":rect[2]-rect[0],"h":rect[3]-rect[1]};
}