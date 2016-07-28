# Programmable voxel-based sandbox

Build your own 3D space in the web with Minecraft-like simplicity and zero deployment efforts.

Using https://github.com/maxogden/voxel-engine (awesome stuff!).

## Get it running on your machine

The first time you set up, you should install the required npm packages:

```
npm install
```

You should also create a .env file with the following fields:
```
PORT = <the port you'd like to run the server>
GITHUB_CLIENT_ID = <the client_id of your Github OAuth app>
GITHUB_SECRET = <the client_secret of your Github OAuth app>
```

*Note: If you're an Unbound VR member, you can use our Github App.*

Then start the server (with a watch):

```
npm run watch
```

## Tests
We use tape for unit testing - in order to run our test, just do:
```
npm test
```
