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
function makeContainer(doc,layers)
{
	var result = true;
	var layName;

	/* beautify ignore:start */
	var w = new Window("dialog", "Enter the Garment Code for " + doc.name);
		var topTxt1 = w.add("statictext", undefined, "For the document: " + doc.name + "...")
		var topTxt2 = w.add("statictext", undefined, "Please enter the the garment code and style number.");
		var input = w.add("edittext", undefined, "Example: FD-136W_023");
		var btnGroup = w.add("group");
			var submit = btnGroup.add("button", undefined, "Submit");
				submit.onClick = function()
				{
					layName = input.text;
					w.close();
				}
			var cancel = btnGroup.add("button", undefined, "Cancel");
				cancel.onClick = function()
				{
					result = false;
					w.close();
				}
	w.show();
	/* beautify ignore:end */

	if (result && layName)
	{
		try
		{
			var container = layers.add();
			container.name = layName;
		}
		catch (e)
		{
			errorList.push("Failed to create a container layer for " + doc.name);
			log.e("Failed while creating a container layer for " + doc.name);
			result = false;
		}
	}

	if (result && layName)
	{
		try
		{
			//loop the layers, unlock and unhide them, then move them to the container layer
			var layLen = layers.length;
			for (var x = layLen - 1; x > 0; x--)
			{
				layers[x].locked = false;
				layers[x].visible = true;
				layers[x].moveToBeginning(container);
			}
		}
		catch (e)
		{
			errorList.push("Failed while moving sublayers into container layer.");
			log.e("Failed while moving sublayers into container layer.");
			result = false;
		}
	}

	return result;
}