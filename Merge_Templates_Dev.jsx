/*
Script Name: Merge Templates
Author: William Dowling
Build Date: 20 September, 2017
Description: Merge two mockups together while preserving correct
			layer structure for other scripts	
*/

#target Illustrator
function container ( master )
{
	var valid = true;
	var scriptName = "merge_templates";



	function getUtilities ()
	{
		var utilNames = [ "Utilities_Container" ]; //array of util names
		var utilFiles = []; //array of util files
		//check for dev mode
		var devUtilitiesPreferenceFile = File( "~/Documents/script_preferences/dev_utilities.txt" );
		function readDevPref ( dp ) { dp.open( "r" ); var contents = dp.read() || ""; dp.close(); return contents; }
		if ( devUtilitiesPreferenceFile.exists && readDevPref( devUtilitiesPreferenceFile ).match( /true/i ) )
		{
			$.writeln( "///////\n////////\nUsing dev utilities\n///////\n////////" );
			var devUtilPath = "~/Desktop/automation/utilities/";
			utilFiles = [ devUtilPath + "Utilities_Container.js", devUtilPath + "Batch_Framework.js" ];
			return utilFiles;
		}

		var dataResourcePath = customizationPath + "Library/Scripts/Script_Resources/Data/";

		for ( var u = 0; u < utilNames.length; u++ )
		{
			var utilFile = new File( dataResourcePath + utilNames[ u ] + ".jsxbin" );
			if ( utilFile.exists )
			{
				utilFiles.push( utilFile );
			}

		}

		if ( !utilFiles.length )
		{
			alert( "Could not find utilities. Please ensure you're connected to the appropriate Customization drive." );
			return [];
		}


		return utilFiles;

	}

	//this boolean denotes whether this
	//script was run independently (standalone = true)
	//or if it was called from the build mockup script
	//(standalone = false);
	//if it was called from build mockup, i don't want 
	//to write the log file for this script
	//because it will be written at the end of the 
	//build mockup script. 
	var standalone = master ? false : true;

	if ( standalone )
	{

		var utilities = getUtilities();

		for ( var u = 0, len = utilities.length; u < len && valid; u++ )
		{
			eval( "#include \"" + utilities[ u ] + "\"" );
		}

		if ( !valid || !utilities.length ) return;
		logDest.push( getLogDest() );
	}


	if ( !valid )
	{
		return;
	}



	if ( user === "will.dowling" )
	{
		DEV_LOGGING = true;
	}


	/*****************************************************************************/
	//=================================  Logic  =================================//

	//get the components
	var devComponents = desktopPath + "automation/merge_templates/components/";
	var prodComponents = componentsPath + "merge_templates/";

	var compFiles = includeComponents( prodComponents, prodComponents, true );
	if ( compFiles.length )
	{
		var curComponent;
		for ( var cf = 0, len = compFiles.length; cf < len; cf++ )
		{
			curComponent = compFiles[ cf ].fullName;
			eval( "#include \"" + curComponent + "\"" );
			log.l( "included: " + compFiles[ cf ].name );
		}
	}
	else
	{
		errorList.push( "Failed to find the necessary components." );
		log.e( "No components were found." );
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
	if ( valid && docLength < 2 )
	{
		errorList.push( "You must have at least 2 documents open." );
		log.e( "Not enough documents open.::There were: " + app.documents.length + " documents open." );
		valid = false;
	}

	if ( valid )
	{
		//check to see whether a master file has already been determined by
		//an outside script (for example the build_mockup script which implements
		//this script). If a master file has already been determined, skip the dialog
		if ( !master )
		{
			if ( docLength === 2 )
			{
				master = app.documents[ 1 ];
			}
			else
			{
				master = getMaster( openDocs );
			}

		}
		if ( !master )
		{
			valid = false;
		}
		else
		{
			masterLayers = master.layers;
			masterArtboards = master.artboards;
		}
	}

	//check the master file for any layers that match the name of
	//the first layer in the source document
	if ( valid )
	{
		app.executeMenuCommand( "fitall" );
		valid = checkLayerNames( sourceDoc, master );
	}


	//
	//initialize the sourceDoc
	//

	//unlock source document
	if ( valid )
	{
		valid = unlockDoc( sourceDoc );
		removeStrayPoints( sourceDoc );
	}

	if ( valid )
	{
		//make sure guides are unlocked
		app.selection = null;
		unlockGuides();
	}


	//get the artboard dimensions from the source document
	if ( valid )
	{
		abDimensions = getArtboardBounds( sourceDoc );
		if ( !abDimensions )
		{
			valid = false;
		}
	}

	//create container layer in source doc
	if ( valid && !isTemplate( sourceDoc ) )
	{
		valid = makeContainer( sourceDoc );
	}





	//copy the artwork from the source doc to the clipboard
	if ( valid )
	{
		valid = copyArt( sourceDoc );
	}




	//
	//process the master document
	//

	if ( valid )
	{
		master.activate();
		app.executeMenuCommand( "fitall" );
	}



	//unlock master document
	if ( valid )
	{
		valid = unlockDoc( master );
		removeStrayPoints( master );
	}

	// create container layer in master document
	if ( valid && !isTemplate( master ) )
	{
		valid = makeContainer( master );
	}

	//create a new artboard in the master file with the same
	//dimensions as the artboard in the sourceDoc
	if ( valid )
	{
		valid = makeNewArtboard( master, abDimensions );
	}



	//paste the artwork into the master file
	if ( valid )
	{
		valid = pasteArt( master );
	}

	app.selection = null;

	//fix up the master file layers
	if ( valid )
	{
		valid = properTemplateSetup( master );
	}

	// app.selection = null;

	// var curName;
	// for(var x=0;x<app.activeDocument.layers.length;x++)
	// {
	// 	curName = app.activeDocument.layers[x].name.toLowerCase();
	// 	if(curName.indexOf("guide")>-1 || curName.indexOf("do not")>-1)
	// 	{
	// 		continue;
	// 	}
	// 	layers[x].locked = false;
	// 	layers[x].visible = true;
	// }




	//=================================  /Procedure  =================================//
	/*****************************************************************************/



	if ( standalone )
	{
		if ( errorList.length > 0 )
		{
			sendErrors( errorList );
		}
		printLog();
	}

	return valid

}
if ( typeof masterFile === "undefined" )
{
	container( undefined );
}
else
{
	container( masterFile )
}
// try
// {
// 	container(masterFile);
// }
// catch(e)
// {
// 	container(undefined);
// }