# Welcome to the Game Review Service!

This is a project in INFT2002 at NTNU to review video games connected to a database.

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

3. Create a database configuration file called "config.ts" in the root directory with the following
   declarations:

```sh
process.env.MYSQL_HOST = '...';
process.env.MYSQL_USER= '...';
process.env.MYSQL_PASSWORD = '...';
process.env.MYSQL_DATABASE = '...';

```

4. Use this SQL code to create the relevant databases:

```sh
CREATE TABBBBBELLLLLL
```

### IGDB API

4. Create a configuration file called "config.ts" in the server folder. This is for the IGDB API
Authorization.

```sh
process.env.CLIENT_ID = '...';
process.env.AUTHORIZATION = '...';

```

### Example IGDB authorization

- Example Client-ID: `"retgzhvpsxjwun0rvrb1rfwheegu1yw"`
- Example Authorization: `"Bearer prau3ol6mg5glgek8m89ec2s9q5i3i"`

4. Run the API:

```sh
cd game-reviews/server/
npm run start

cd game-reviews/client/
npm run start

```

6. The web page can be found on your server, or locally on your computer at the port you selected (standard port is 3000).