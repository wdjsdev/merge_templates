/*

Script Name: Merge Templates
Author: William Dowling
Build Date: 30 November, 2016
Description: Merge Templates Rebuild. Needs to account for improper locked/visibility within layer structure.
Build number: 4.0

Progress:

	Version 4.001
		30 November, 2016
		Initial rebuild.
		Working swimmingly up through makeNewArtboard function.
		All that's left is to:
			unlock all artwork/layers in master file
			paste the artwork (and layer structure) into master file
			lock appropriate layers in master file.

	Version 4.002
		6 December, 2016
		Added getNewAbBounds function to make an appropriately sized artboard in the master file
			rather than simply using the existing artboard size. This will allow artboards to 
			be properly sized for hoodies or other odd sized mockups with no further intervention
			from the mockup artist.
		Added unlockMaster function to prepare master file for incoming artwork.
		Still need to:
			turn on paste remembers layers
			paste artwork in place
			turn off paste remembers layers
			lock appropriate artwork and layers on master file 


*/

function container()
{

	/*****************************************************************************/

	///////Begin/////////
	///Logic Container///
	/////////////////////

	//sendErrors Function Description
	//Display any errors to the user in a preformatted list
	function sendErrors(errorList)
	{
		var localValid = true;
	
		alert(errorList.join("\n"));
	
	
		return localValid
	}



	//getMaster Function Description
	//Open a dialog box so the user can select which document the art should be copied to.
	//set global variable 'master' to the selected document
	function getMaster()
	{
		var localValid = true;
		var result;

		log.l("Beginning getMaster function.");
		
		if(app.documents.length >= 2)
		{
			//there are 2 or more documents.
			//open a dialog to prompt user for which document to merge to.
			
			//make new dialog window
			var w = new Window("dialog", "Which document should I merge the artwork to?");

				//add a message to the window
				var msg = w.add("statictext", undefined, "Which of the following documents is the master file?");

				//add a button group to the window
				var btnGroup = w.add("group");
				btnGroup.orientation = "column";

					//loop all open documents, except the activeDocument,
					//and create a button for each one.
					for(var a=1;a<app.documents.length;a++)
					{
						var thisDoc = app.documents[a];
						makeButton(thisDoc);
						log.l("Made a button for the document: " + thisDoc.name);
					}
					var horzRule = btnGroup.add("panel");
					horzRule.minimumSize.height = horzRule.maximumSize.height = 3;
					var cancel = btnGroup.add("button", undefined, "Cancel");
					cancel.onClick = function()
					{
						localValid = false;
						log.l("User pressed Cancel in getMaster dialog. Aborting script.\n");
						w.close();
					}

					//makeButton Function Description
					//make a button in btnGroup for the document passed in
					//set an onClick function to set 'result' to the clicked document and close dialog
					function makeButton(doc)
					{
						var name = doc.name;
						var thisButton = btnGroup.add("button", undefined, name);
						thisButton.onClick = function()
						{
							result = doc;
							log.l("User selected " + doc.name + " as master file.");
							w.close();
						}
					}

			w.show();

		}
		else
		{
			errorList.push("Sorry\nYou need at least 2 documents open.");
			log.l("Only one document open. Aborting script.")
			localValid = false;
		}
		
		master = result;
		if(result != undefined)
		{
			log.l("getMaster function is complete. Master file = " + result.name + "\n\n");
		}
	
		return localValid;
	}

	//unlockSource Function Description
	//unlock all the layers, sublayers and objects in the source document
	//so that a copy and paste will work properly.
	function unlockSource(doc)
	{
		var localValid = true;
		var localErrors;
	
		var lay = doc.layers;

		log.l("Attempting to delete USA Collars layer.")
		//Try/Catch Description:
		//delete a USA collars layer if exists
		try
		{
			lay[0].layers["USA Collars"].visible = true;
			lay[0].layers["USA Collars"].remove();
			log.l("Successfully removed USA Collars layer.")
		}
		catch(e)
		{
			log.l("No USA Collars layer to remove.")
		}

		log.l("Running loop to unlock and unhide all top level layers.")

		for(var a=0;a<lay.length;a++)
		{
			lay[a].locked = false;
			lay[a].visible = true;
		}


		app.executeMenuCommand("showAll");
		app.executeMenuCommand("unlockAll");
		log.l("Sucessfully unlocked and unhid all elements.::unlockSource function returning " + localValid + "\n\n");
		
		
	
	
		return localValid
	}

	//getNewAbBounds Function Description
	//use the bkgrd layer to determine the size of the new artboard in the master file
	function getNewAbBounds(doc)
	{
		var localValid = true;
	
		var lay = doc.layers["BKGRD, do not unlock"];
		var newGroup = doc.groupItems.add();
		for(var a=0;a<lay.pageItems.length;a++)
		{
			var thisItem = lay.pageItems[a];
			thisItem.duplicate(newGroup);
		}
		newAbWidth = newGroup.width;
		newAbHeight = newGroup.height;
		newGroup.remove();
	
		return localValid
	}

	//copyArt Function Description
	//select all art from docRef and copy to clipboard
	function copyArt()
	{
		var localValid = true;
	
		try
		{
			app.executeMenuCommand("selectall");
			app.executeMenuCommand("copy");
		}
		catch(e)
		{
			log.e("Failed while selecting and copying art from source document.....?");
			localValid = false;
		}
	
	
		return localValid
	}

	//unlockMaster Function Description
	//unlock the guides and bkgrd layers to accomodate incoming artwork
	function unlockMaster(doc)
	{
		var localValid = true;
		var guidesLayExist = false;
		var bkgrdLayExist = false;

		//check to see whether the master file has guides and bkgrd layers

		log.l("Verifying existence of guides layer.");
		try
		{
			var guides = doc.layers["Guides"];
			guidesLayExist = true;
			log.l("Guides layer exists. Sucessfully set guides variable.")
		}
		catch(e)
		{
			log.l("No Guides layer exists.");
		}

		log.l("Verifying Existence of BKGRD, do not unlock layer.");
		try
		{
			var bkrd = doc.layers["BKGRD, do not unlock"];
			bkgrdLayExist = true;
			log.l("BKGRD layer exists. sucessfully set bkrd variable.");
		}
		catch(e)
		{
			log.l("No BKGRD layer exists.")
		}

		if(guidesLayExist)
		{
			log.l("Attempting to unluck/unhide master file Guides layer.")
			try
			{
				doc.layers["Guides"].locked = false;
				doc.layers["Guides"].visible = true;
				log.l("Master file Guides layer succesfully unlocked/unhid.::Ready for art to be pasted.");
			}
			catch(e)
			{
				errorList.push("Failed while unlocking/unhiding Guides Layer.");
				log.e("Failed while unlocking/unhiding maaster file Guides layer.");
				localValid = false;
			}
		}
		if(bkgrdLayExist)
		{
			log.l("Attempting to unluck/unhide master file BKDRD, do not unlock layer.")
			try
			{
				doc.layers["BKDRD, do not unlock"].locked = false;
				doc.layers["BKDRD, do not unlock"].visible = true;
				log.l("Master file BKDRD, do not unlock layer succesfully unlocked/unhid.::Ready for art to be pasted.");
			}
			catch(e)
			{
				errorList.push("Failed while unlocking/unhiding BKGRD, do not unlock Layer.");
				log.e("Failed while unlocking/unhiding maaster file BKDRD, do not unlock layer.");
				localValid = false;
			}
		}

	
	
		return localValid
	}

	//makeNewArtboard Function Description
	//create a new artboard in the master file
	function makeNewArtboard(master,w,h)
	{
		log.l("Beginning makeNewArtboard function.");
		var localValid = true;

		var masterAb = master.artboards;
	
		var curAbCount = masterAb.length;
		log.l("Master file (" + master.name + ") has " + curAbCount + " artboards to start with.");
		var lastAb = masterAb[curAbCount-1];
		var rect = lastAb.artboardRect;
		var newAbBounds;
		var moveRight = 2100;
		var moveDown = 2600;

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
				var left = rect[0] + moveRight;
				var top = rect[1];
				var right = left + w;
				var bot = top - h;
				// newAbBounds = [rect[0]+moveRight,rect[1],rect[2]+moveRight,rect[3]];
				newAbBounds = [left,top,right,bot];
				break;
			case 4:
				rect = masterAb[0].artboardRect;
				newAbBounds = [rect[0],rect[1]-moveDown,rect[2],rect[3]-moveDown];
				break;
			case 8:
				rect = masterAb[0].artboardRect;
				newAbBounds = [rect[0],rect[1]-moveDown*2,rect[2],rect[3]-moveDown*2];
				break;
			case 12:
				errorList.push("Sorry. You can't have more than 12 mockups in a single document.");
				log.e("There were already 12 artboards in the document. Can't do more than 12. Aborting script.");
				localValid = false;
		}

		if(localValid)
		{
			masterAb.add(newAbBounds);
			log.l("Successfully added a new artboard to the master file with bounds: " + newAbBounds);
		}
	
	
		return localValid
	}



	////////End//////////
	///Logic Container///
	/////////////////////

	/*****************************************************************************/

	///////Begin////////
	////Data Storage////
	////////////////////

	var lib = 
	{
		
	}

	#include "/Volumes/Customization/Library/Scripts/Script Resources/Data/Utilities_Container.js";


	////////End/////////
	////Data Storage////
	////////////////////

	/*****************************************************************************/

	///////Begin////////
	///Function Calls///
	////////////////////

	var scriptVersion = "4.001";

	var docRef = app.activeDocument;
	var newAbWidth;
	var newAbHeight;
	var masterIsTemplate = true;
	var errorList = [];

	var master;

	//log the beginning of script executionn
	log.h("Begin Script.::" + user + " ran Merge_Templates version " + scriptVersion + "::docRef = " + docRef.name + "::this is the merge FROM file.");

	var valid = getMaster();

	if(valid)
	{
		log.l("Beginning unlockSource function.\n");
		valid = unlockSource(docRef);
	}
	if(valid)
	{
		log.l("Beginning getNewAbBounds function.\n");
		valid = getNewAbBounds(docRef);
	}
	if(valid)
	{
		log.l("Beginning copyArt function.\n");
		valid = copyArt();
	}
	if(valid)
	{
		log.l("Beginning unlockMaster function.\n");
		unlockMaster(master);
	}
	if(valid)
	{
		master.activate();
		makeNewArtboard(master,newAbWidth,newAbHeight);
	}
	if(valid)
	{

	}

	printLog();



	////////End/////////
	///Function Calls///
	////////////////////

	/*****************************************************************************/

	if(errorList.length>0)
	{
		sendErrors(errorList);
	}
	return valid

}
container();