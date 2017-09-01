/*


Script Name: Merge Templates
Author: William Dowling
Build Date: 20 September, 2016
Description: Merge two files together into a single master file
Build number: 3.0

Progress:

	Version 3.001
		20 September, 2016
		Complete rebuild to increase efficiency, clean up the code and handle contingencies
			such as merging non-template files.
		

*/

function container()
{

	/*****************************************************************************/

	///////Begin/////////
	///Logic Container///
	/////////////////////

	//getTargetDoc Function Description
	//populate all open documents, less the active one, and display them in a dialog
	//for the user to choose which document the art should be merged to.
	function getTargetDoc()
	{
		if(app.documents.length>1){
			var targetIndex = new Window("dialog", "Which is Master");
				var newTextGroup = targetIndex.add("group");
					newTextGroup.text = targetIndex.add("statictext",undefined,"Which file do you want to merge to?");
					newTextGroup.align = "center";
				var radioGroup = targetIndex.add("group");
					radioGroup.alignChildren = "left";
					radioGroup.orientation = "column";
					for(var a=0;a<app.documents.length;a++){
						if(app.documents[a] != app.activeDocument){
							radioGroup.add("radiobutton",undefined,app.documents[a].name);
						}
					}
					radioGroup.children[0].value = true;
				var buttonGroup = targetIndex.add("group");
					var ok = buttonGroup.add("button", undefined, "OK");
					var can = buttonGroup.add("button", undefined, "Cancel");
			function selected(which){
				for(var c=0;c<which.children.length;c++){
					if(which.children[c].value == true){
						return which.children[c].text;
					}
				}
			}

			if(targetIndex.show() == 1){
				return (selected(radioGroup));
			}
			else{
				return;
			}

			targetIndex.show();
		}
		else{
			alert("You need to have more than 1 document open!");
			valid = false;
			return;
		}
	}



	//createNewArtboard Function Description
	//once the master file has been established, create a new artboard in the master file and
	//position it such that a prepress can fit between the new artboard and the previous one.
	function createNewArtboard(rect)
	{	
		var localValid = true;
		var moveRight = 2100;
		var moveDown = 2600;
		var newRect = 
		{
			l:rect[0], t:rect[1], r:rect[2], b:rect[3]
		}
		//determine where on the drawing area the new artboard should be placed.
		var count = master.artboards.length;

		switch(count)
		{
			case 1:
			case 2:
			case 3:
				newRect.l += (moveRight*master.artboards.length);
				newRect.r += (moveRight*master.artboards.length);
				break;
			case 4:
			case 8:
				
		}
		if(count != 4 && count != 8)
		{
			newRect.l += (moveRight * master.artboards.length);
			newRect.r += (moveRight * master.artboards.length);
		}

		//move down to row 2
		if(count >= 4 && count < 8)
		{
			newRect.t -= moveDown;
			newRect.b -= moveDown;
		}

		//move down to row 3
		else if(count >= 8 && count < 12)
		{
			newRect.t -= (moveDown*2);
			newRect.b -= (moveDown*2);
		}

		//too many artboards. push to errorList and return
		else if(count == 12)
		{
			errorList.push("Sorry.. Only 12 mockups are allowed in one file.");
			localValid = false;
		}

		if(localValid)
		{
			newRect = [newRect.l,newRect.t,newRect.r,newRect.b];
			var newAB = master.artboards.add(newRect)
		}

		return localValid;
	}



	////////End//////////
	///Logic Container///
	/////////////////////

	/*****************************************************************************/

	///////Begin////////
	////Data Storage////
	////////////////////




	////////End/////////
	////Data Storage////
	////////////////////

	/*****************************************************************************/

	///////Begin////////
	///Function Calls///
	////////////////////

	var docRef = app.activeDocument;
	var layers = docRef.layers;
	var master = app.documents[getTargetDoc()];
	if(master == null){return};

	alert(master);
	var valid;

	valid = createNewArtboard(docRef.artboards[0].artboardRect);

	if(valid)
	{

	}
	else
	{
		sendErrors(errorList);
		return false;
	}

	if(valid)
	{

	}
	else
	{
		sendErrors(errorList);
		return false;
	}


	////////End/////////
	///Function Calls///
	////////////////////

	/*****************************************************************************/

}
container();