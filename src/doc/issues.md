#1
[@src/quizzes/categorize/single]
CSS Not loading; Shows unstyled component.

#3
[@src/quizzes/blanks/single]
Needs a layout redesign 

#4
[@src/quizzes/matching/original]
Add options:

- Remove headers
- Name headers

#5
[@ALL]
Allow 'checkButtonEnabled: bool' and adapt components to collapse the area of 
the button in case end user wants to implement their own to keep the original
displays minimal. They can then add a click event to their custom button that
triggers the 'check()' function of the renderer.

#6
[@ALL]
Add a 'instructionsRemovable: true' flag to the components, and a 
'instructionsEnabled' setter to determine if rendering the instructions as well.
The removable flag indicates if the component itself has some sort of instructions
area, as some like @matching-wheels or @blanks-single do not.


