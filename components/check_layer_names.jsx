/*
	Component Name: check_layer_names
	Author: William Dowling
	Creation Date: 25 September, 2017
	Description: 
		loop the layers in the master file and determine whether
		any of the layer names match the name of the garment layer
		in the source document.
		If true, then append a sequence letter to the end of the name
		to ensure every layer in the master file has a unique name.
	Arguments
		source document object
		master document object
	Return value
		success boolean

*/

function checkLayerNames(sourceDoc,master)
{
	log.h("checkLayerNames(" + sourceDoc.name + ", " + master.name + ")");
	var result = true;
	var possibleLetters = ["B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
	var sourceLayer = sourceDoc.layers[0];
	var sourceLayerName = sourceLayer.name;
	var pat = /_[a-z]$/i;

	while(matchExists(sourceLayerName) && possibleLetters.length > 0)
	{
		sourceLayerName = sourceLayerName.replace(pat,"");
		sourceLayerName += "_" + possibleLetters[0];
		possibleLetters.splice(0,1);
	}

	if(sourceLayerName !== sourceLayer.name)
	{
		log.l("The master file contained a layer that matched the name of the garment layer in the source doc.")
		log.l("Updated source doc layer name from " + sourceLayer.name + " to " + sourceLayerName);
		sourceLayer.name = sourceLayerName;
	}

	log.l("checkLayerNames result = " + result);
	return result;

	function matchExists(name)
	{
		var match = false;
		var len = master.layers.length;
		var thisLay;
		for(var x=0;x<len && !match;x++)
		{
			thisLay = master.layers[x].name;
			if(thisLay === sourceLayerName)
			{
				match = true;
			}
		}
		return match;
	}
}