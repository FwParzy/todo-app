# Todo App

## PLEASE READ THIS ENTIRE FILE IF YOU WANT THIS TO RUN PROPERLY
## Initial Settup  
~Note: i am doing this on Linux, Windows repro will be slightly different and idk how to give repro for that~  
1. Clone this repo onto your machine and `cd` into the project  
2. run `npm i` inside the root of the project `todo-app/.`  
3. `cd server` and run `npm i` again  
4. `cp .env.sample .env` and edit this new `.env` to have the values I sent you  
    * ~For windows users this is just coppying the sample env into a new .env file and adding the correct values~  
5. In the current directory `todo-app/server/.` place the `ca-app.crt` here  
    * This gives the program 'permission' to talk to the db even though you have the password.  
6. Your all set up! there are a few ways to run my app, so if one breaks please try another.
## Starting the app
### Development ~Easiest~
1. Go to the root dir of the project after doing the Initial Settup
2. Run `npm run devserv`
3. Boom done, mess around with it.  
### Production ~Harder~
1. Go to the root dir of the project after doing the Initial Settup
2. Run `npm run build`
3. Once it's done building do `cd server && npm start`
    * **LEAVE THIS RUNNING WHILE YOU USE THE APP! IT MAINTIANS THE CONNECTION TO THE HOSTED DB**  
4. In your finder / file explorer go to the dir of the project,  
    * Open the releases folder, and then the version number folder, this should be something like `1.0.0`
    * Double click the application file
5. If you dont want to use the file explorer, cd into the version number folder and do `./${appname}`
    * Replace ${appname} with the name of the app
    * If this doesnt work run `chmod +x ${appname}` to make it executeable and do the `./${appname}` command again
6. Boom done, mess around with it.

## App tutorial
First things first, register an account and then login with it.  
On first the page should be mostly blank with no red text. Click on the `Add a Category` button and you should se a textbox appear.
Enter in the name of the category you want to create, it could be something like `Todays tasks`. CLicking the `Add Category` button now
should create a new header. You can click the new header now and enter in a Task youd like to complete eventually. 
Clicking the circle next to the task name now will complete it, and completed tasks delete at midnight. 
If you want to edit a task or delete it early, click on the task name, not the circle, to bring the task edit form.
You can do things here like complete them, change their category, delete them or change the name of it.
If you messed up your Category or would like to delete it, click the waffle in line with the Category name on the right.
Here you can delete or rename categories. If you want to move your todo list to another application, click the `Download as Md` button.
Lastly if your user is wrong or you want to change the password, click the `Edit ${user.username}` button.
This takes you to a page where you can edit your own user.  
Thanks for using my app!!


ADD GLOBAL SHORTCUT TO README
