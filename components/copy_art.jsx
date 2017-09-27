/*
	Component Name: copy_art
	Author: William Dowling
	Creation Date: 27 September, 2017
	Description: 
		Copy all of the artwork in the source document to the clipboard
	Arguments
		source document object
	Return value
		success boolean

*/

function copyArt(doc)
{
	log.h("copyArt(" + doc.name + ")");
	var result = true;
	
	doc.activate();
	try
	{
		app.executeMenuCommand("selectall");
		app.executeMenuCommand("copy");
		doc.selection = null;
		log.l("Successfully copied all artwork in source document.");
	}
	catch(e)
	{
		log.e("Failed to copy the artwork in the source doc.::System error message: " + e);
		errorList.push("Failed while copying the artwork from the source document.");
		result = false;
	}

	log.l("copyArt result = " + result);
	return result;
}