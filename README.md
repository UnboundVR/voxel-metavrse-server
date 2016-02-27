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

*Note*: If you're an Unbound VR member, you can use our Github App.

Then run the gulp command to start watchify:
```
gulp
```

Then run the server:

```
npm start
```

Or if you want to use nodemon:

```
npm run dev
```

Then point your browser to `http://localhost:<the port you chose above>` and have fun!

## Controls
- When you start, click on the page to lock cursor. Press `<ESC>` to unlock cursor.
- `<W,A,S,D>` => move.
- `<R>` => toggle third person view.
- `Click` => destroy block.
- `<CONTROL> + click` => place block.
- `Right click` => edit the code of a block.

## License

BSD
