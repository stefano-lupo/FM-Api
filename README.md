# Node-Server
Testing out making a basic server with Node \
[Basic Tutorial Here](https://zellwk.com/blog/crud-express-mongodb/)

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
    
    
    Reading state information... Done
    W: Duplicate sources.list entry http://mirrordirector.raspbian.org/raspbian/ jessie/main armhf Packages (/var/lib/apt/lists/mirrordirector.raspbian.org_raspbian_dists_jessie_main_binary-armhf_Packages)
    W: Duplicate sources.list entry http://mirrordirector.raspbian.org/raspbian/ jessie/contrib armhf Packages (/var/lib/apt/lists/mirrordirector.raspbian.org_raspbian_dists_jessie_contrib_binary-armhf_Packages)
    W: Duplicate sources.list entry http://mirrordirector.raspbian.org/raspbian/ jessie/non-free armhf Packages (/var/lib/apt/lists/mirrordirector.raspbian.org_raspbian_dists_jessie_non-free_binary-armhf_Packages)
