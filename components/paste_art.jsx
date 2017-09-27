/*
	Component Name: paste_art
	Author: William Dowling
	Creation Date: 26 September, 2017
	Description: 
		paste the copied artwork into the master file on the newly created artboard
	Arguments
		master document object
	Return value
		success boolean

*/

function pasteArt(doc)
{
	log.h("pasteArt(" + doc.name + ")");
	var result = true;

	doc.activate();
	try
	{
		app.pasteRemembersLayers = true;
		app.executeMenuCommand("pasteInPlace");
		app.pasteRemembersLayers = false;
		doc.layers[0].zOrder(ZOrderMethod.SENDTOBACK);	
	}
	catch(e)
	{
		log.e("Failed while pasting artwork into master file.::System error message: " + e);
		errorList.push("Failed while pasting artwork into the master file. This is likely an MRAP error. Please restart AI and try again.");
		result = false;
	}

	log.l("pasteArt result = " + result);
	return result;
}