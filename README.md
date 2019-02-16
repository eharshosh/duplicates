This small tool accepts a path parameter and finds all the duplicate files in it.
A duplicate file must have the same name and the same contents.

**Getting started:**
1. clone this project and enter the local project's directory
2. Run `npm install`
3. Run `npm start`
4. Open your favorite browser and browse to `localhost:3333/duplicates?dir=<your_path>`
5. Run `npm test` to run the unit tests

**Few things worth mentioning:**
- I've decided to create a plain node project. No boilerplate, only _express_ for routing, _eslint_ for code styles, _nodemon_ for hot reload and _mocha_ for testing. Adding frontend to the mix would have bloated it up so I've decided to let go. 
- As it is a small project, I kept the structure relatively flat. In a real scale project there will be a more complex structure.
- I've decided to ignore hidden files. No use in comparing _.git_ directories and _.DS_Store_ files.