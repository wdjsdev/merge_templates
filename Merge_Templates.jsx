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
	var comps = includeComponents(devPath,prodPath);
	if(comps)
	{
		var compLen = comps.length;
		for(var c=0;c<compLen;c++)
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
		master,masterLayers,masterArtboards;


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
		master = getMaster(openDocs);
		if(!master)
		{
			valid = false;
			log.l("User cancelled dialog. Exiting script.");
		}
		else
		{
			masterLayers = master.layers;
			masterArtboards = master.artboards;
		}
	}

	if(valid)
	{
		//add container to sourceDoc if necessary
		if(!isTemplate(sourceDoc))
		{
			valid = makeContainer(sourceDoc,sourceLayers);
		}

		//add container to master file if necessary
		if(valid && !isTemplate(master))
		{	
			master.activate();
			valid = makeContainer(master,masterLayers);
			sourceDoc.activate();
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
