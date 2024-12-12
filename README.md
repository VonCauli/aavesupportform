This GitHub Repo contains both the front-end and back-end of the Aave Support Form. At this time, the back-end is incomplete, and all submissions simply go to the browser console log. I have attempted to route them to a graphQL server with Apollo, but am having a bit of trouble. Thus, safely ignore the folder “support-form-graphql-server”

The “support-form-front-end” folder contains all the functional UI code. 

- `../src/lib/apolloClient.ts` is where to add the GraphQL URI
- `../src/components` contains the typescript files used for the interactive UI.
    - `../contactForm.tsx` contains the support form UI logic with all the submission fields.
        - Line 147 is where attachments are logged.
    - `../Header.tsx` contains the layout for the Header while `../NavItem.tsx` contains the navigation buttons logic
- `../src/styles` contains all the CSS code. There is a lot of “unused” logic here from when I was testing animations, such as fade-ins.
- `../public` contains AAVE branding from when I was testing animations
