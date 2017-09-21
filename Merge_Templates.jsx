/*

Script Name: Merge Templates
Author: William Dowling
Build Date: 20 September, 2017
Description: Merge two mockups together while preserving correct
			layer structure for other scripts
	
	
*/

function container()
{
	var version = 5;
	var valid = true;

	#include "/Volumes/Customization/Library/Scripts/Script Resources/Data/Utilities_Container.js";

	logDest.push(new File("~/Desktop/automation/logs/merge_templates_log.txt"));

	log.h("Begin::Merge_Templates version: " + version + "::Executed by: " + user);

	/*****************************************************************************/
	//=================================  Logic  =================================//
	
	function getMaster(openDocs)
	{
		log.h("getMaster()")
		var result;
		var curName;
		var btns = [];

		/* beautify ignore:start */
		var w = new Window("dialog", "Select the master file.");
			var topTxt = w.add("statictext", undefined, "Select the master file.");
			var btnGroup = w.add("group");
				btnGroup.orientation = "column";
				for(var x=1;x<docLength;x++)
				{
					curName = openDocs[x].name;
					btns[x] = btnGroup.add("button", undefined, curName);
					btns[x].onClick = function()
					{
						result = openDocs[curName];
						log.l("User selected: " + curName);
						w.close();
					}
				}
				var cancel = btnGroup.add("button", undefined, "Cancel");
					cancel.onClick = function()
					{
						w.close();
					}

		w.show();
		/* beautify ignore:end */
		return result;
	}

	//=================================  /Logic  =================================//
	/*****************************************************************************/




	/*****************************************************************************/
	//=================================  Data  =================================//
	
	var docRef = app.activeDocument,
		layers = docRef.layers,
		aB = docRef.artboards,
		swatches = docRef.swatches,
		openDocs = app.documents,
		docLength = openDocs.length;


	//=================================  /Data  =================================//
	/*****************************************************************************/


	/*****************************************************************************/
	//=================================  Procedure  =================================//
	
	//verify the existence of a document
	if(valid && docLength < 2)
	{
		errorList.push("You must have at least 2 documents open.");
		log.e("Not enough documents open.::There were: " + app.documents.length + " documents open.");
		valid = false;
	}

	if(valid)
	{
		if(!getMaster(openDocs))
		{
			valid = false;
			log.l("User cancelled dialog. Exiting script.");
		}
	}


	//=================================  /Procedure  =================================//
	/*****************************************************************************/

	if(errorList.length>0)
	{
		sendErrors(errorList);
	}

	printLog();

	return valid

}
container();