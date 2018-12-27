# Server

## How to use createCardRouter()

It takes two arguments, the first being the route name, and the second (optional) the io.

It requires a JSON file at ```${__dirname}/${route}/${route}```, for instance the route chess would get the file at app/chess/chess.json.<br/><br/>
The JSON must contain an abject with an array as the cards parameter, every card must have a Title and a path.<br/><br/>
Optionally there are some flags for the Object (toAuthenticate, iframe, socket, pathRedirect, unhandeled)
and some extra specification for the card (body, src)

### Examples!<br/>
in main.js
```javascript
createCardRouter('home');
```
in home/home.json
```javascript
{
  "pathRedirect": true,
  "unhandled": true,
  "cards": [
    {
      "title": "Chess!",
      "body": "Play Chess against another human, yourself or an algorithm (Artificial intelligence)",
      "path": "chess"
    }
  ]
}
```
In this case it would create a router for the card Chess, the image would be at /public/cards/home/chess.png.<br/>
The redirect would be /chess and it would be unhandled.<br/>
The view home/home would be rendered for the cards.<br/><br/>

in main.js
```javascript
createCardRouter('wwe', io);
```
in wwe/wwe.json
```javascript
{
  "socket": true,
  "cards": [
    {
      "title": "Guess the logo!",
      "body": "You will be presented with a logo, and three possible answers",
      "path": "logo"
    }
  ]
}
```
In this case it would create a router for the card Logo!, the image would be at /public/cards/wwe/logo.png.<br/>
To access the card the user has to be authenticated (not to see the cards!) because of the socket flag.<br/>
The redirect would be /wwe/logo. (no pathRedirect flag).<br/>
The view wwe/wwe would be rendered.<br/>
For the cards it would be rendered wwe/logo (no iframe flag) if it were, it would render the projects/project view.<br/>
It would be required the module at ./wwe/setupSocket_logo, it expects a function which takes a socket and the user (must be authenticated).<br/><br/>

in main.js
```javascript
createCardRouter('chess', io);
```
in chess/chess.json
```javascript
{
  "toAuthenticate": true,
  "iframe": true,
  "socket": true,
  "cards": [
    {
      "title": "Artificial intelligence",
      "body": "Play against an artificial intelligence",
      "path": "ai"
    },
    {
      "title": "Challenge a human",
      "body": "Search a match against a real player",
      "path": "player"
    },
    {
      "title": "Singleplayer",
      "body": "Play against yourserl",
      "path": "single"
    }
  ]
}
```
