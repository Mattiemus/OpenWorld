# OpenWorld

OpenWorld is a multiplayer data driven game engine written in TypeScript using ThreeJS, CannonJS, and React 
for its front end, and soon to use a NodeJS server for the game server. Ultimately this is currently an
expiriment with both React and to see how far I can push the browser to create interesting 3D experiences.

The data driven nature of the engine means that it will be trivial to implement server and client side scripting,
changes to the data model fires events for both property and hierachy changes, which service implementations, such as 
both the render service and physics service can hook onto, and through the use of proxy objects lead to a fully decoupled
code structure, where the only difference between client and server code will (in theory) be these service implementations.

![Screenshot](https://github.com/Mattiemus/OpenWorld/blob/master/screenshot.png?raw=true)