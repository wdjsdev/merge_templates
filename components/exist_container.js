/*
	Component Name: existContainer
	Author: William Dowling
	Creation Date: 20 October, 2017
	Description: 
		check whether a container layer has already been created in the document
	Arguments
		layers array
	Return value
		boolean

*/

function existContainer(layers)
{
	var result = false;

	var len = layers.length;
	var curLay;
	for(var x=0;x<len && !result;x++)
	{
		curLay = layers[x];
		if(curLay.name.toLowerCase().indexOf("container") > -1)
		{
			result = true;
		}
	}

	return result;
}