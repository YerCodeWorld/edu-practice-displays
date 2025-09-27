Custom components 

For more convenience, some custom components are created to satisfy an specific renderer
or more than one if possible. Between these:

- Letter Picker: Allows to select an ASCII letter uniquely
- Color Picker: A super simple API with limited colors, avoiding the huge built-in API
- Global: A simple [question, hint, input type] component to ask input in many different ways 

The components are classes that extend the HTMLElement class. Each might be unique when it comes 
to the attributes or properties it provides, and so each API has its unique application. 

Exercise Displays

These are functions that follow a very clear structure, as can be seen in the folder structure.

- HTML fille (inner layout)
- CSS stylesheet 
- themes.ts (an object with all bodies with the different css variables)
- script file with contract export 

The script.ts file gets everything together and makes it shine, creating a root element, and 
appending the innerHTML and applying the theme selected using helper functions. The style is 
appended to the head of the document instead, which we need to becareful with. To remove these
we need to remove the stylesheet with that particular ID, which we need to update in the contract
to be able to have access to. 

The script contains a function with receives the parent html element (what the end client will be using),
the data for the exercise and options. These last two would need to have separate logic to be
handled, like providing a text area to input the grammar of an exercise and then render it, or a form
for providing the necessary information for the exercise options or metadata. Each system might handle
it differently.

Once we have out themes, stylesheet, layout and options, the file also provides a default parser, so it
can be used to take the code of the exercise and transform it into the correct data object. There's also
a validator which returns a boolean if truthy. Finally, we have a big contract object of a global
ContractType that contains in a single variable all the tooling needed for the usage of the exercise,
like renderer, validator, parser, themes, html, css, name, example grammar, version, usage, avoid, 
image, description, etc. 

The renderers use typescript only, transpiled to return the JS bundle. In theory, we should be able 
to use it in any framework since the components just need an HTMLElement to work. As an extra note, 
the renderers also return helper function to destroy, apply theme, finish the exercise or most importantly, 
return - and do something externally with the return result.


'Teacher bryan is explaining a class, until something not at all unexpected happens...'
