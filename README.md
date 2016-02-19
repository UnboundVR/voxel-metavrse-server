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
GITHUB_SECRET = <the github secret of your Github app, for authentication> 

```

*Note:* Currently the Github client_id is hardcoded in the constants file, but that will be fixed soon :)

Then run the gulp command to start watchify:
```
gulp
```

Then run the server:

```
npm start
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
