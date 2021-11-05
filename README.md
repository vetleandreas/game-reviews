# Web Development Project INFT2002: Game Review

Web development project course INFT2002.

## Instructions

1. Download the project:

```sh
git clone https://github.com/vetleat/game-reviews.git
```

2. Install dependencies with npm:

```sh
cd game-reviews/server/
npm install

cd game-reviews/client/
npm install
```

3. Create a database configuration file called "config.js" in the root directory with the following
   declarations:

```sh
process.env.MYSQL_HOST = '...';
process.env.MYSQL_USER= '...';
process.env.MYSQL_PASSWORD = '...';
process.env.MYSQL_DATABASE = '...';

```

## IGDB API Settings

Create a configuration file called "config.ts" in the server folder. This is for the IGDB API
Authorization

Example Client-ID: "retgzhvpsxjwun0rvrb1rfwheegu1yw"

Example Authorization: "Bearer prau3ol6mg5glgek8m89ec2s9q5i3i"

```sh
process.env.CLIENT_ID = '...';
process.env.AUTHORIZATION = '...';

```

4. Run the API:

```sh
cd game-reviews/server/
npm run start

cd game-reviews/client/
npm run start

```
