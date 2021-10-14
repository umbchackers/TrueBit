# TrueBit 

## Setup and Install
Right now I'm using node 16.6. As long as it's 16+, you should be fine. Latest Discord.js version (13.2) requires you to have node 16. 
I'm using yarn for my package manager and I recommend you do to. It makes things easier and that's what I have the package.json setup for right now.

### Install yarn
```
npm install -g yarn
```
what? What were you expecting? It's really that easy lmao

### Dev steps
* clone the repo
* `yarn install`
* Fire up your fav editor, app starts in index.ts

For testing, make sure you got an `.env` file with your bot token (doesn't matter which one, just make sure you aren't sharing them with anyone) and a ENV property as well. I've added an example .env you can use. After that, run `yarn dev`
You'll see a "I'm Ready" in console.

### Things to note
**DO NOT COMMIT/PUSH TO MASTER**

When you wanna add your changes or whatever, I recommend just making a new branch and pushing that branch onto this repo. Setup a Pull Request and I can look at it and merge it (or hackumbc tech team can look at it, whichever works).

Anyway yeah I think that's it