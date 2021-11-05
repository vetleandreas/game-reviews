# WebSocket example: Whiteboard

## Setup database connections

This example does not use any database. You can therefore create empty `config.ts` files:

```sh
touch server/config.ts server/test/config.ts
```

## Start server

Install dependencies and start server:

```sh
cd server
npm install
npm start
```

### Run server tests:

```sh
npm test
```

Compared to the previous example project, the only additional dependency is
[ws](https://www.npmjs.com/package/ws).

## Bundle client files to be served through server

Install dependencies and bundle client files:

```sh
cd client
npm install
npm start
```
