# LeagueIO

## Game Design
https://docs.google.com/document/d/1lkn_6DEJM0_5s4hQyzyCxnCK3TgB1-iweKnq1r7r-4c/edit#

## Local Development

`npm start`: Run this when confirming that feature works with transpiled JS.

`npm run build:live`: Use this command to develop on typescript. It will watch all *ts files under src/ and restart the server if a file changes.

`npm run clean`: Clean up `dist` folder

`npm run lint`: Run ESLint on project

`npm run build`: Cleans the dist folder before copying over non ts files to corresponding folder in dist (Pleas make sure it is enumerated in one of the tasks see package.json) and also transpiles typescript to js and serves code from `dist` folder.

## Todo

Need to enforce strict mode in tsconfig.json