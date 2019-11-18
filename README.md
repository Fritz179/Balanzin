# Balanzin
## Basic concept:

I have created this "Framework" to manage my website, it works around the concept of cards.<br>
Every card stands for a different directory that can be accessed.<br>
For instance, at the top route you can choose what game you want to play, if the game is itself divided in different parts, the process can be easily repeated recursively.<br>
### .json
This file contains information about the current page, a `title` and `p` key must be specified, both are strings and are the title and the description of the cardMenu respectively.<br>
Every card is specified in the .json file, it has the `cards` key, an array which contains all the information on how to display the card and where to redirect the user if the card is clicked and also, if further subdirectory must be loaded.<br>
If you want to load the subdirectory but you don't want to display a card (as for login) you can specify a `subDir` just as cards
### cards
Every card has a `title` and `p` key for the card's title and description.<br>
It also must have a third key, which is one of the following: `path`, `extend` or `custom`. This is also a string and it is where the user will be redirected when the card is clicked and is used as the path of the image. The difference between the three keys is:<br>
`path` ----- no further loading, no \_server is required, use if only index.html is needed<br>
`extend` -- just load the subfolder recursively, .json in \_server is needed use if a subCardRouter is needed<br>
`custom` -- keep loading subfolder, router.js in \_server is needed (optionally a .json too), but must be called in router.js
### flags
Some flags can be set too, they are booleans and can be set on either the json file or on each card separately, if it's specified only in the json, all cards have the same flags, but if in both places id specified a flag with a different value the card flag is chosen, the flags are:<br>

`socket` used if you want to connect with a socket, a socket.js file is required in the \_server<br>
`authenticate` use if login is required to access the page, no further file required<br>
`pw` coming soon, specifies a password to access the page<br>
`preventRecursion` bool, used to display cards in cardMenu but not load the subdirectory [use with custom and router.js]<br>
`renderer` string, only in json, defaults to cardMenu, set to index.js to send different html, set to false for not rendering anything (useful for custom, or placeholder, like /users is empty, but /users/login, /users/register has to load)<br>
Multiple flags can be set at the same time<br>
<br>
<br>
## Example

In essence every route has \_server folder unless it's the bottom route and it doesn't need a socket connection or a special router.
In the next example is shown how to best arrange the file structure, in the main.js ca be specified a different top folder

<br>
In main.js:
```javascript
const app = require('express')()
const io = require('socket.io')()
const createRouter = require('./setup/createRouter.js');

app.use('/', createRouter(io, path.join(__dirname, 'home')))
```
<br>
The top folder (home), is always displayed as a cardRouter, unless a different renderer is specified, if you want to load some routes without showing them as cards, use the subDir property instead of the cards.<br>
Images name must have the same name and must be in the \_server folder
<br>
### card types
In home/\_server/.json
```json
{
  "title": "Welcome to the website",
  "p": "a short description!",
  "cards": [
    {
      "title": "path_project example",
      "p": "description of the project",
      "path": "path_project"
    },
    {
      "title": "extend_project",
      "p": "Description of the project",
      "extend": "extend_project"
    },
    {
      "title": "custom_project",
      "p": "description of project",
      "custom": "custom_project"
    }
  ],
  "subDir": [
    {
      "extend": "users"
    }
  ]
}
```
### flags
since the custom_project uses the custom key to specify the subdirectory, another .json file is required<br>
<br>

in home/custom_project/\_server/.json
```json
{
  "title": "SubCardMenu of custom_project",
  "p": "another short description!",
  "cards": [
    {
      "title": "router_project",
      "p": "description of the project",
      "path": "path_project",
      "router": true
    },
    {
      "title": "socket_project",
      "p": "Description of the project",
      "extend": "path_project",
      "socket": true
    }
  ]
}
```
#### router
If the socket flag is set to true, the module called router.js in the \_server is called with one argument, an object containing `{router, io, loadSocket, directory, createRouter, customRouter}`, the most useful are:<br>
`router` -- the express router to use.<br>
`directory` -- the current directory (without first slash)<br>
`createrRouter` -- a function that loads a .json<br>
`customRouter` -- a function that calls a router.js<br>
`loadSocket` -- a function that loads the socket.js<br>
<br>

In home/custom_project/\_server/router.js
```javascript
module.exports = ({router, directory, createRouter}) => {
  router.use('/', createRouter(directory)) //keeps loading subdirectories w/out cardMenu {renderer: false}

  router.get('/', (req, res) => {
    Article.find({}, checkErrors(req, res, doc => {
      res.render(join(directory, 'index.ejs'), {articles: doc})
    }, () => {
      req.flash('danger', 'nothing found')
      res.rredirect('/articles')
    }))
  })
}

```

#### socket
If the socket flag is set to true, the module called socket.js in the \_server is called with two arguments, the socket connection and the user.<br>
If in the .json the authenticate flag wasn't set to true, the function will be called with the user only if it's logged in, if it isn't it will be undefined<br>
<br>

in home/custom_project/router_project/\_server/router.js
```javascript
module.exports = (socket, user) => {
	socket.emit('your_username', user.username)
}
```
#### pw
Coming soon
<br>

## File Structure
all the projects name may be modified, but the \_server, .json, socket.js and router.js can't be changed<br>
<br>
The example above has the following file structure:
```
home
│
└───_server
│   │   .json
│   │   path_project.png
│   │   extend_project.png
│   │   custom_project.png
│   
└───path_project
│   │   index.ejs
│   │   main.js
│
└───extend_project
│   │
│   └───_server
|   |   |   .json
|   |   |   *.png
|   │
│   └───router_project
|   |   |
|   |   └───_server
|   |   |   |   router.js
|   |   |
|   |   |   index.ejs
|   |   |   main.js
|   |
│   └───socket_project
|       |
|       └───_server
|       |   |   socket.js
|       |
|       |   index.ejs
|       |   main.js
|
└───custom_project1
    │
    └───_server
    |   |   .json
    |   |   router.js
    │
    └───custom_project2
    |   |
    |   └───_server
    |   |   |   router.js
    |   |
    |   |   index.ejs
    |   |   main.js
    |
    |   index.ejs
```
