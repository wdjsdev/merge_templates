/*
Script Name: Merge Templates
Author: William Dowling
Build Date: 20 September, 2017
Description: Merge two mockups together while preserving correct
			layer structure for other scripts	
*/

function container(master)
{
	var version = 5;
	var valid = true;

	eval("#include \"/Volumes/Customization/Library/Scripts/Script Resources/Data/Utilities_Container.jsxbin\"");

	if(user === "will.dowling")
	{
		logDest.push(new File("~/Desktop/automation/logs/merge_templates_log.txt"));
	}
	else
	{
		logDest.push( new File("/Volumes/Customization/Library/Scripts/Script Resources/Data/.script_logs/merge_templates_log.txt"));
	}

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
		masterLayers, masterArtboards;

		var abDimensions = {};


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
		//check to see whether a master file has already been determined by
		//an outside script (for example the build_mockup script which implements
		//this script). If a master file has already been determined, skip the dialog
		if(!master)
		{
			master = getMaster(openDocs);
		}
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
		valid = unlockDoc(sourceDoc);
		removeStrayPoints(sourceDoc);
	}

	//unlock master document
	if(valid)
	{
		valid = unlockDoc(master);
		removeStrayPoints(master);
	}

	//create container layer in source doc
	if (valid && !isTemplate(sourceDoc))
	{
		valid = makeContainer(sourceDoc);
	}

	// create container layer in master document
	if (valid && !isTemplate(master))
	{
		valid = makeContainer(master);
	}

	//get the artboard dimensions from the source document
	if(valid)
	{
		abDimensions = getArtboardBounds(sourceDoc);
		if(!abDimensions)
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

	//create a new artboard in the master file with the same
	//dimensions as the artboard in the sourceDoc
	if(valid)
	{
		valid = makeNewArtboard(master,abDimensions);
	}

	//copy the artwork from the source doc to the clipboard
	if(valid)
	{
		valid = copyArt(sourceDoc);
	}

	//paste the artwork into the master file
	if(valid)
	{
		valid = pasteArt(master);
	}

	//fix up the master file layers
	if(valid)
	{
		valid = properTemplateSetup(master);
	}

	app.selection = null;


	//=================================  /Procedure  =================================//
	/*****************************************************************************/

	if (errorList.length > 0)
	{
		sendErrors(errorList);
	}

	printLog();

	return valid

}

try
{
	container(masterFile);
}
catch(e)
{
	container(undefined);
}