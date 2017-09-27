/*
	Component Name: make_new_artboard
	Author: William Dowling
	Creation Date: 26 September, 2017
	Description: 
		Create a new artboard in the master file at the
		given dimensions
	Arguments
		master file document object
		dimensions object
	Return value
		success boolean

*/

//makeNewArtboard Function Description
//create a new artboard in the master file
function makeNewArtboard(doc,dim)
{
	doc.activate();
	log.h("makeNewArtboard(master, {w:" + dim.w + " ,h:" + dim.h + ")");
	
	var result = true;
	var curAbCount = masterArtboards.length;
	var lastAb = masterArtboards[curAbCount-1];
	var rect = lastAb.artboardRect;
	var newAbBounds;
	var moveRight = 2100;
	var moveDown = 2600;
	var left,top,right,bot;

	switch(curAbCount)
	{
		case 1:
		case 2:
		case 3:
		case 5:
		case 6:
		case 7:
		case 9:
		case 10:
		case 11:
			//No need to make a new row. Just place a new artbooard to the right of the last existing artboard.
			left = rect[0] + moveRight;
			top = rect[1];
			break;

		case 4:
			//Ran out of room in the first row. Make a new row and place this new artboard directly below the first one.
			rect = masterArtboards[0].artboardRect;
			left = rect[0];
			top = rect[1] - moveDown;
			log.l("Started the second row of artboards.")
			break;

		case 8:
			//ran out of room in the second row. Make a new row and place this new artboard directly below the fifth one.
			rect = masterArtboards[0].artboardRect;
			left = rect[0];
			top = rect[1]-moveDown*2,
			log.l("Started the third row of artboards.");
			break;

		case 12:
			//too many artboards. Alert and abort.
			errorList.push("Sorry. You can't have more than 12 mockups in a single document.");
			log.e("There were already 12 artboards in the document. Can't do more than 12. Aborting script.");
			result = false;
	}

	if(result)
	{
		right = left + dim.w;
		bot = top - dim.h;
		newAbBounds = [left,top,right,bot];
		masterArtboards.add(newAbBounds);
		log.l("Successfully added a new artboard to the master file with bounds: " + newAbBounds);
	}

	log.l("makeNewArtboard result = " + result);
	return result
}