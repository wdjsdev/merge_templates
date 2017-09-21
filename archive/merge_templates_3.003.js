//Merge Template Rebuild
//Author: William Dowling
//Date: 9/17/15

/*

	31 May, 2016
	Something happened recently that caused artwork layers to not be copied.
	
	Narrowed the issue down to the existence of the USA Collars sublayer.
	Simply removed USA Collars from the mix and then proceed with script as normal.

	updated 9 Aug, 2016:
		added block to unlock and re-lock "edges" object on mockup layer.. otherwise the script would fail.

*/


function mergeDocuments(){

	function getTargetDoc(){
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
	
	function createNewArtboard(){
		master.activate();
		var aBcount = master.artboards.length;
		var lastAB = master.artboards[master.artboards.length-1];
		var aB = lastAB.artboardRect;
		var left = aB[0];
		var top = aB[1];
		var right = aB[2];
		var bot = aB[3];
		var moveRight = 2100;
		var moveDown = 2600;
		if(aBcount != 4 && aBcount != 8){
			var newLeft = left + moveRight;
			var newRight = right + moveRight;
			var rect = [newLeft,top,newRight,bot];
			var newAb = master.artboards.add(rect);
		}
		else{
			var originAb = master.artboards[0].artboardRect;
			var oLeft = originAb[0];
			var oTop = originAb[1];
			var oRight = originAb[2];
			var oBot = originAb[3];
			if(aBcount >=4 && aBcount<8){
				oTop = oTop - moveDown;
				oBot = oBot - moveDown;
			}
			else if(aBcount>=8 &&aBcount<=12){
				oTop = oTop - (moveDown*2);
				oBot = oBot - (moveDown*2);
			}
			var rect = [oLeft,oTop,oRight,oBot];
			var newAb = master.artboards.add(rect);
		}
		
		//determine how far in which direction the duplicates should move
		if(aBcount < 4){
			move = [(aBcount)*2100, 0]
		}
		else if(aBcount == 4){
			move = [0,3000];
		}
		else if(aBcount>4 && aBcount<8){
			move = [(aBcount)*2100, 3000];
		}
		else if(aBcount == 8){
			move = [0,6000];
		}
		else if(aBcount > 8 && aBcount<12){
			move = [(aBcount)*2100, 6000];
		}
		else{
			alert("Sorry. No more than 12 mockups are allowed in the same file.");
			valid = false;
			return;
		}
	}
	
	function copyArt(){
		docRef.activate();
		app.executeMenuCommand('selectall');
//         translateArt(docRef.selection,move[0],move[1]);
		app.executeMenuCommand('copy');

		//removed this section because it didn't need to happen for all templates
		
		// var sourceArtLayers = docRef.layers[0].layers["Artwork Layer"].layers;
		// for(var a=0;a<sourceArtLayers.length;a++)
		// {
		//     artLayers.push(sourceArtLayers[a].name);
		// }
	}
	
	function pasteArt(){
		master.activate();
		if(app.pasteRemembersLayers == false){
			app.pasteRemembersLayers = true;
			app.executeMenuCommand('pasteInPlace');
			app.pasteRemembersLayers = false;
		}
		else{
			app.executeMenuCommand('pasteInPlace');
		}
		app.selection = null;

		//removed this section because it didn't need to happen for all templates

		//create artwork layers
		// var artLayer = master.layers[0].layers.add();
		// artLayer.name = "Artwork Layer";

		// for each(a in artLayers)
		// {
		//     var thisArtLayer = artLayer.layers.add();
		//     thisArtLayer.name = a
		// }
	}
	
	function translateArt(sel,right,down){
		for(var a=0;a<sel.length;a++){
			var cur = sel[a];
			sel.left = sel.left + right;
			sel.top = sel.top - down;
		}
	}

	function searchForName(objects,term)
	{
		for(var x = 0;x<objects.length;x++)
		{
			if(objects[x].name.indexOf(term)>-1)
			{
				return objects[x]
			}
		}
		return undefined;
	}

	function checkForLockedObjects(layer)
	{

		for(var x=0; x<layer.pageItems.length;x++)
		{
			if(layer.pageItems[x].locked)
			{
				layer.pageItems[x].locked = false;
			}
		}
		for(var x=0;x<layer.layers.length;x++)
		{
			if(layer.layers[x].locked)
			{
				layer.layers[x].locked = false;
			}
		}
	}
	
	function lockUnlockBg(lock,doc){
		master.layers.getByName("Guides").locked = lock;
		master.layers.getByName("BKGRD, do not unlock").locked = lock;
		var mock = doc.layers[0].layers["Mockup"];
		checkForLockedObjects(mock);
		if(searchForName(mock.pageItems,"Edge") != undefined)
		{
			var edg = doc.layers[0].layers["Mockup"].pageItems["Edges"];
			edg.locked = lock;
		}

		//check for NFHS requirements
		var info = doc.layers[0].layers["Information"]
		checkForLockedObjects(info);
		// if(searchForName(info.pageItems, "NFHS Requirements") != undefined)
		// {
		// 	if(info.locked)
		// 	{
		// 		info.locked = false;
		// 	}
		// 	info.pageItems["NFHS Requirements"].locked = lock;

		// 	if(lock)
		// 	{
		// 		info.locked = true;
		// 	}
		// }

	}
	
	function unlockSource(){
        try{
            docRef.layers[0].layers["USA Collars"].visible = true;
            docRef.layers[0].layers["USA Collars"].remove();
        }
        catch(e)
        {
            //no usa collar layer to remove
        }
		docRef.layers.getByName("Guides").locked = false;
		docRef.layers.getByName("BKGRD, do not unlock").locked = false;
		docRef.layers[0].layers.getByName("Information").locked = false;
		docRef.layers[0].layers.getByName("Prepress").visible = true;
		docRef.layers[0].layers.getByName("Artwork Layer").locked = false;
	}
	 
	function lockArtMaster(){
		var theLayer = master.layers[0];
		theLayer.layers.getByName("Information").locked = true;
		theLayer.layers.getByName("Prepress").visible = false;
		theLayer.zOrder(ZOrderMethod.SENDTOBACK);
		master.layers.getByName("Guides").zOrder(ZOrderMethod.SENDTOBACK);
		master.layers.getByName("BKGRD, do not unlock").zOrder(ZOrderMethod.SENDTOBACK);
	}
	
	
	/////////////////
	///Script Main///
	/////////////////
	
	/////////////////////////////
	///Script Global Variables///
	/////////////////////////////
	
	var docRef = app.activeDocument;
	var layers = docRef.layers;
	var masterFile = getTargetDoc();
	if(masterFile == null){return;}
	var master = app.documents.getByName(masterFile);
	var valid = true;
	var move = [];
	var artLayers = [];
	
	///////////////////////
	///Function Callouts///
	///////////////////////
	
	
	createNewArtboard();
	if(valid){
		unlockSource();
		lockUnlockBg(false,docRef);
	}
	if(valid){
		copyArt();
		pasteArt();
	}
	lockArtMaster();
	lockUnlockBg(true, master);    
	
	
}
mergeDocuments();