# Node-Server
Testing out making a basic server with Node \
[Basic Tutorial Here](https://zellwk.com/blog/crud-express-mongodb/) |
[Authentication Tutorial Here](https://scotch.io/tutorials/easy-node-authentication-setup-and-local)
## Basic Usage
* **Dev**: ***npm run start*** - Starts Dev server with nodemon and babel
* **Build**: ***npm run build*** - Transpiles code for distribution 


## Packages Used
* Express 
    * Takes care of a bunch of setting up the server and gives access to the usual ***app***
    and all of its functionality
* Mongodb
    * Standard Mongo DB client
* Nodemon 
    * Automatically restarts server on file changes
        * Installed as a dev dependency with 
        ***npm install nodemon --save-dev***
        * Also made a small script called dev (in package.json) which can be ran with ***npm run dev***
         which starts server with nodemon
* Body-Parser
    * Middleware that handles data that comes in with the request and makes it accessible through ***req.body***
* Babel
    * Transpiles ES6 to ES5 
* Passport, Passport Local, Passport Facebook 
    * Adds easy authentication methods 
* bcrypt-nodejs 
    * Add password hashing functionality
* Morgan
    * Middleware that logs every request made (when in dev mode)