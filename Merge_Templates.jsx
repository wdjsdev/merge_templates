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

	//import the necessary components
	var devPath = "~/Desktop/automation/merge_templates/components";
	var prodPath = "/Volumes/Customization/Library/Scripts/Script Resources/components/merge_templates";
	var comps = includeComponents(devPath, prodPath);
	if (comps)
	{
		var compLen = comps.length;
		for (var c = 0; c < compLen; c++)
		{
			eval("#include \"" + comps[c] + "\"");
		}
	}
	else
	{
		valid = false;
	}

	//=================================  /Logic  =================================//
	/*****************************************************************************/



	/*****************************************************************************/
	//=================================  Data  =================================//

	var sourceDoc = app.activeDocument,
		sourceLayers = sourceDoc.layers,
		sourceAb = sourceDoc.artboards,

		openDocs = app.documents,
		docLength = openDocs.length,
		master, masterLayers, masterArtboards;

		var newArtboardBounds = {};


	//=================================  /Data  =================================//
	/*****************************************************************************/


	/*****************************************************************************/
	//=================================  Procedure  =================================//

	//verify the existence of necessary documents
	if (valid && docLength < 2)
	{
		errorList.push("You must have at least 2 documents open.");
		log.e("Not enough documents open.::There were: " + app.documents.length + " documents open.");
		valid = false;
	}

	if (valid)
	{
		master = getMaster(openDocs);
		if (!master)
		{
			valid = false;
		}
		else
		{
			masterLayers = master.layers;
			masterArtboards = master.artboards;
		}
	}

	//unlock source document
	if(valid)
	{
		sourceDoc.activate();
		valid = unlockDoc(sourceDoc);
	}

	//unlock master document
	if(valid)
	{
		master.activate();
		valid = unlockDoc(master);
	}

	//create container layer in source doc
	if (valid && !isTemplate(sourceDoc))
	{
		sourceDoc.activate();
		valid = makeContainer(sourceDoc);
	}

	// create container layer in master document
	if (valid && !isTemplate(master))
	{
		master.activate();
		valid = makeContainer(master);
		sourceDoc.activate();
	}

	//get the artboard dimensions from the source document
	if(valid)
	{
		newArtboardBounds = getArtboardBounds(sourceDoc);
		if(!newArtboardBounds)
		{
			valid = false;
		}
	}

	//check the master file for any layers that match the name of
	//the first layer in the source document
	if(valid)
	{
		valid = checkLayerNames(sourceDoc,master);
	}


	//=================================  /Procedure  =================================//
	/*****************************************************************************/

	if (errorList.length > 0)
	{
		sendErrors(errorList);
	}

	printLog();

	return valid

}
container();