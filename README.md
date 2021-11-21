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

process.env.CLIENT_ID = '...';
process.env.AUTHORIZATION = '...';

```
Example client ID and authorization
This is for the IGDB API Authorization. Without correct API Client-ID and Authorization, the App
will not load games.

- Example Client-ID: `"retgzhvpsxjwun0rvrb1rfwheegu1yw"`
- Example Authorization: `"Bearer prau3ol6mg5glgek8m89ec2s9q5i3i"`


4. Use this SQL code to create the relevant databases:

```
CREATE TABLE `gamescore` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `score_id` int(11) NOT NULL,
 `game_id` varchar(255) NOT NULL,
 `score` int(11) NOT NULL,
 PRIMARY KEY (`id`)
)
```

```
CREATE TABLE `game_review` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `review_name` varchar(255) NOT NULL,
 `review_title` varchar(255) NOT NULL,
 `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 `review_text` text NOT NULL,
 `created_by_id` varchar(255) NOT NULL,
 `game_id` varchar(255) NOT NULL,
 `review_password` varchar(255) NOT NULL,
 PRIMARY KEY (`id`)
)
```

```
CREATE TABLE `game_review_relevance` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `user_id` varchar(255) NOT NULL,
 `review_id` varchar(255) NOT NULL,
 `upvote` tinyint(1) NOT NULL,
 PRIMARY KEY (`id`)
)
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
