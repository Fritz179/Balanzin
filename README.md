# Server

# How to use createCardRouter()

It takes two arguments, the first being the route name, and the second (optional) the io.

It requires a JSON file at `${__dirname}/${route}/${route}`, for instance the route chess would get the file at app/chess/chess.json.
The JSON must contain an abject with an array as the cards parameter, every card must have a Title and a path.
Optionally there are some flags for the Object (toAuthenticate, iframe, socket, pathRedirect, unhandeled)
and some extra specification for the card (body, src)

Examples!

createCardRouter('home')
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
In this case it would create a router for the card Chess, the image would be at /public/cards/home/chess.png,
The redirect would be /chess and it would be unhandled.
The view home/home would be rendered for the cards

createCardRouter('wwe')
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
In this case it would create a router for the card Logo!, the image would be at /public/cards/wwe/logo.png,
To access the card the user has to be authenticated (not to see the cards!) because of the socket flag
The redirect would be /wwe/logo. (no pathRedirect flag)
The view wwe/wwe would be rendered
For the cards it would be rendered wwe/logo (no iframe flag) if it were, it would render the projects/project view 
It would be required the module at ./wwe/setupSocket_logo, it expects a function which takes a socket and the user (must be authenticated)
