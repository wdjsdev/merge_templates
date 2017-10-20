/*
	Component Name: make_container
	Author: William Dowling
	Creation Date: 22 September, 2017
	Description: 
		create a container layer and put all other layers inside it
	Arguments
		document object
	Return value
		succes boolean

*/
function makeContainer(doc)
{
	doc.activate();
	log.h("makeContainer(" + doc.name + ")");
	var result = true;
	var layers = doc.layers,layName;
	var containerExists = existContainer(layers);

	if(layers.length > 1 && !containerExists)
	{
		/* beautify ignore:start */
		var w = new Window("dialog", "Enter the Garment Code for " + doc.name);
			var topTxt1 = w.add("statictext", undefined, "For the document: " + doc.name + "...")
			var topTxt2 = w.add("statictext", undefined, "Please enter the the garment code and style number.");
			var input = w.add("edittext", undefined, "Example: FD-136W_023");
				input.active = true;
			var btnGroup = w.add("group");
				var submit = btnGroup.add("button", undefined, "Submit");
					submit.onClick = function()
					{
						layName = input.text;
						log.l("User entered " + layName);
						w.close();
					}
				var cancel = btnGroup.add("button", undefined, "Cancel");
					cancel.onClick = function()
					{
						result = false;
						log.l("User cancelled dialog.");
						w.close();
					}
		w.show();
		/* beautify ignore:end */

		if (result && layName)
		{
			try
			{
				var container = layers.add();
				container.name = layName + " container";
				log.l("Successfully added a container layer.")
			}
			catch (e)
			{
				errorList.push("Failed to create a container layer for " + doc.name);
				log.e("Failed while creating a container layer for " + doc.name + "::System error message was: " + e);
				result = false;
			} 
		}

		if (result && layName)
		{
			try
			{
				//loop the layers, unlock and unhide them, then move them to the container layer
				var layLen = layers.length;
				var layName;
				for (var x = layLen - 1; x > 0; x--)
				{
					layName = layers[x].name;
					layers[x].locked = false;
					layers[x].visible = true;
					layers[x].moveToBeginning(container);
					log.l("Moved layer: " + layName + " to container layer.");
				}
				log.l("Successfully moved all layers to container layer.");
			}
			catch (e)
			{
				errorList.push("Failed while moving sublayers into container layer.");
				log.e("Failed while moving sublayers into container layer.::System error message was: " + e);
				result = false;
			}
		}
	}
	else
	{
		log.l("Only one layer in this document. Not creating a container layer."); 
	}

	

	log.l("makeContainer result = " + result);
	return result;
}