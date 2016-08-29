# Programmable voxel-based sandbox

Build your own 3D space in the web with Minecraft-like simplicity and zero deployment efforts.

Using https://github.com/maxogden/voxel-engine (awesome stuff!).

## Get it running on your machine

The first time you set up, you should:

1 - Install the required npm packages:

```
npm install
```

2 - Create a .env file with the following fields:
```
PORT = <the port you'd like to run the server>
GITHUB_CLIENT_ID = <the client_id of your Github OAuth app>
GITHUB_SECRET = <the client_secret of your Github OAuth app>
DATABASE_HOST = <self explanatory>
DATABASE_PORT = <self explanatory>
DATABASE = <the name of your database - can be just 'metavrse'>
ADMIN_USER_ID = <the Github username that will own the base items, terrain, etc.>
```

*Note: If you're an Unbound VR member, you can use our Github App.*

3 - Initialize the database by running the following command:
```
npm run scaffold-db
```

Then you can start the server (with a watch):

```
npm run watch
```

## Tests
We use tape for unit testing - in order to run our test, just do:
```
npm test
```
