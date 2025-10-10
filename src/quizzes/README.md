Base component structure

Utils at ./utils/utils.ts

- Shuffle

Accepts and returns and a shuffled array of generics.

- injectStyle

Takes a string (expected to be css), and injects it into
an element by a passed id paramter.

- applyTheme

Modifies the head of the document of the component and applies
a different theme handed by a record (varName: string, val: strig).

Types and Vars

Each component has unique types, but must follow a logic

- componentReturnHandler interface, for outter logic
- typeRendererOptions (which will be updated to take JSON config files)
- baseCSS
- BaseHTML
- ...

Main Function

createTypeRenderer() function, which generally takes the following
parameters:

- mount: HTMLElement, which is the parent element it will be appended to
- items: ExerciseType[]. which takes the expected valid JSON structure Exercise
- opts: Which populate the renderer options interface 

