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

Then run the watch (to auto-rebuild sass and js on each change):
```
npm run watch-client
```

Then start the server (also with a watch):

```
npm run watch-server
```

Then point your browser to `http://localhost:<the port you chose above>` and have fun!

*Note: If you're using the Unbound VR Github App, you must use the port `1337`.*

## Tests
We use tape for unit testing - in order to run our test, just do:
```
npm test
```

## Controls
- When you start, click on the page to lock cursor. Press `<ESC>` to unlock cursor.
- `<W,A,S,D>` => move.
- `<R>` => toggle third person view.
- `Click` => destroy block.
- `<CONTROL> + click` => place block.
- `Right click` => edit the code of a block.

## License

BSD
