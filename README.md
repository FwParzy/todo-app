# Todo App

## PLEASE READ THIS ENTIRE FILE IF YOU WANT THIS TO RUN PROPERLY
## Initial Settup  
*Note: i am doing this on Linux, Windows repro will be slightly different and idk how to give repro for that*  
1. Clone this repo onto your machine and `cd` into the project  
1. run `npm i` inside the root of the project `todo-app/.`  
1. Cd into server `cd server` and `npm i`
1. Cd into the root of the project `cd ..`
1. Your all set up! there are a few ways to run my app, so if one breaks please try another.

## Starting the app
### Development *Harder* - Dev with Local server
1. Make sure you have mysql installed on your machine. For mac or linux run `brew install mysql`
1. Do `cp server/.env.sample server/.env.dev` and change `DB_USER` and `DB_PASS` to your mysql user and pass
1. Run `node server/seeders/dbSeeder.js` and enter in your username and password
1. Run `npm run devserv`
1. Boom done, mess around with it.  

### Development *Easy* - Dev with Prod server
1. Place the file `.env.prod` that I gave you, in `server` next to the other `.env` files
1. Run `NODE_ENV=prod npm run dev`
1. Boom done, mess around with it.  

### Production *Easy* - App with Prod server
1. Place the file `.env.prod` that I gave you, in `server` next to the other `.env` files
1. Run `NODE_ENV=prod npm run build`
1. Once it's done building, Open the app with your file explorer.  
    * It should be in `./releases` folder inside the repo
1. Boom done, mess around with it.

## App tutorial
* Register a user and a tutorial should generate!
* If you want to export your notes, Click the `Export as Md` button
* Emails are not really used yet so enter in anything
