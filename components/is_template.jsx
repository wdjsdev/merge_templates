/*
	Component Name: is_template
	Author: William Dowling
	Creation Date: 22 September, 2017
	Description: 
		Check the given document to see whether it is a proper converted
	Arguments
		document object
	Return value
		boolean value

*/

function isTemplate(doc)
{
	log.h("isTemplate(" + doc.name + ")");
	var result, curLay, curName, subLay;
	var subLayers = ["Artwork Layer", "Mockup", "Prepress", "Information"],
		len = subLayers.length;

	try
	{
		curLay = doc.layers[0];
		if (curLay.name === "To Be Placed")
		{
			log.l(doc.name + " has a to be placed layer. treating this document as if it's not a converted template.")
			result = false;
		}
		else
		{
			for (var x = 0; x < len; x++)
			{
				curName = subLayers[x];
				subLay = curLay.layers[curName];
				log.l("Successfully found the " + curName + " layer.");
			}
			log.l("All the necessary layers are there. This looks like a proper converted template.");
			result = true;
		}
	}
	catch (e)
	{
		result = false;
		log.l("Failed to find the " + curName + " layer. Treating " + doc.name + " as a non-converted template.");
	}

	return result;

}