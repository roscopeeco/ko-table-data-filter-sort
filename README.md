# ko-table-data-filter-sort
Knockout Table Data Filtering Sorting and Column selection

Functionality
=============

Displays a table of data json data returned via an Ajax call and allows immediate data filtering, bi-directional sorting and column display selection

Table data
==========
The data structure includes a number of array fields such as tags, range & friends. The name field is also made up of two child fields first & last.
To display this data in the table I made the decision to create a single string field for each of the above which contains the array entries delimited by a comma.

Filtering data
==============
The filter functionality has been implemented to automatically filter after the user stops typing for 400 milliseconds. 
This provides immediate feedback for the user without the need to click a button.
The filter routine will check to see if the user has entered a partial field name and abandon the filter if they have
When a full fieldname is detected e.g. company.ext the filter will only be applied on that field
In all other cases the filter is on all fields
The filter type applied is logged in the console
The filter sets a show observable value for each entry which is then bound to a visible binding in the html

Showing and Hiding Columns
==========================
The 'Select Columns' checkbox option is used to show/hide columns.
It has an initial state of false and with this setting no show/hide options appear in the column headings but hidden columns will not display.
When the checkbox is ticked ALL columns are displayed with a checkbox option next to each heading. 
The 'hidden' columns are displayed with an opacity of 0.5 to differentiate them from the visible columns.
The user can them click on the heading checkbox to show/hide a column and when they click on 'Select Columns' again the relevant columns are hidden.

Sorting
=======
Clicking a column head will sort by that column. The first time the column is clicked it will be sorted ascending and then if it is clicked again
it will be sorted in descending order so long as no other column has been sorted in the interim.

Libraries
=========
This example uses the following libraries:
jQuery
Bootstrap
Knockout

General
=======
I attempted to use the components feature but I am unable to get require working with jQuery 
(I need some advice on getting $ working) so have had to abandon fully componentising and use standard Knockout.

I was originally going to use my own libraries for sorting and filtering but decided against this as the base libraries would have needed modifying to 
implement the functionality required so I have written everything from scratch so everything is fully visible for the purposes of the exercise.
