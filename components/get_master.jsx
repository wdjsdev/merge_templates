/*
	Component Name: get_master
	Author: William Dowling
	Creation Date: 22 September, 2017
	Description: 
		Prompt the user to select the correct master file.
	Arguments
		An array of all open documents
	Return value
		document object or undefined

*/

function getMaster(openDocs)
{
	log.h("getMaster(" + openDocs + ")");
	var result;

	/* beautify ignore:start */
	var w = new Window("dialog", "Select the master file.");
		var topTxt = w.add("statictext", undefined, "Which of the following documents is the master file?");
		var btnGroup = w.add("group");
			btnGroup.orientation = "column";
			for (var x = 1; x < docLength; x++)
			{
				makeButton(openDocs[x]);
			}
			var cancel = btnGroup.add("button", undefined, "Cancel");
				cancel.onClick = function()
				{
					log.l("User cancelled getMaster dialog.")
					result = false;
					w.close();
				}

	w.show();
	/* beautify ignore:end */

	log.l("getMaster result = " + result);
	return result;

	function makeButton(doc)
	{
		var curName = doc.name;
		var thisButton = btnGroup.add("button", undefined, curName);
		log.l("Created " + curName + " button.");
		thisButton.onClick = function()
		{
			result = doc;
			log.l("::User selected: " + curName);
			w.close();
		}
	}
}