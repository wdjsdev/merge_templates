/*
Script Name: Merge Templates
Author: William Dowling
Build Date: 20 September, 2017
Description: Merge two mockups together while preserving correct
			layer structure for other scripts	
*/

function container(master)
{
	var valid = true;
	var scriptName = "merge_templates";

	function getUtilities()
	{
		var result = [];
		var networkPath,utilPath,ext,devUtilities;

		//check for dev utilities preference file
		var devUtilitiesPreferenceFile = File("~/Documents/script_preferences/dev_utilities.txt");

		if(devUtilitiesPreferenceFile.exists)
		{
			devUtilitiesPreferenceFile.open("r");
			var prefContents = devUtilitiesPreferenceFile.read();
			devUtilitiesPreferenceFile.close();

			devUtilities = prefContents === "true" ? true : false;
		}
		else
		{
			devUtilities = false;
		}

		if(devUtilities)
		{
			utilPath = "~/Desktop/automation/utilities/";
			ext = ".js";
		}
		else
		{
			if($.os.match("Windows"))
			{
				networkPath = "//AD4/Customization/";
			}
			else
			{
				networkPath = "/Volumes/Customization/";
			}

			utilPath = decodeURI(networkPath + "Library/Scripts/Script Resources/Data/");	
			ext = ".jsxbin";

		}

		result.push(utilPath + "Utilities_Container" + ext);
		result.push(utilPath + "Batch_Framework" + ext);
		return result;

	}

	var utilities = getUtilities();
	if(utilities)
	{
		for(var u=0,len=utilities.length;u<len;u++)
		{
			eval("#include \"" + utilities[u] + "\"");	
		}
	}
	else
	{
		alert("Failed to find the utilities..");
		return false;	
	}

	if(!valid)
	{
		return;
	}

	logDest.push(getLogDest());


	/*****************************************************************************/
	//=================================  Logic  =================================//
	
	//get the components
	var devComponents = desktopPath + "automation/build_mockup/components";
	var prodComponents = componentsPath + "build_mockup_beta";

	var compFiles = includeComponents(devComponents,prodComponents,false);
	if(compFiles.length)
	{
		var curComponent;
		for(var cf=0,len=compFiles.length;cf<len;cf++)
		{
			curComponent = compFiles[cf].fullName;
			eval("#include \"" + curComponent + "\"");
			log.l("included: " + compFiles[cf].name);
		}
	}
	else
	{
		errorList.push("Failed to find the necessary components.");
		log.e("No components were found.");
		valid = false;
		return valid;
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