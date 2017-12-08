/*
	Component Name: remove_stray_points
	Author: William Dowling
	Creation Date: 07 December, 2017
	Description: 
		remove any stray points from the given document
	Arguments
		doc
			document object
	Return value
		void

*/

function removeStrayPoints(doc)
{
	doc.selection = null;
	app.executeMenuCommand("Stray Points menu item");
	app.executeMenuCommand("clear");
}