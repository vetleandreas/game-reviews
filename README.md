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
//SQL Database Authorization
process.env.MYSQL_HOST = '...';
process.env.MYSQL_USER= '...';
process.env.MYSQL_PASSWORD = '...';
process.env.MYSQL_DATABASE = '...';

// IGDB Authorization
process.env.CLIENT_ID = '...';
process.env.AUTHORIZATION = '...';

```
#### Example client ID and authorization:
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

5. Run the API:

```sh
cd game-reviews/server/
npm run start

cd game-reviews/client/
npm run start

```

6. The web page can be found on your server, or locally on your computer at the port you selected (standard port is 3000).

## About the application
### Getting to a game

When you first load up the page, make sure your database is connected correctly (or in NTNU's case, that you're connected to their VPN to get access). 
Then you will be greeted by the home page. To go to a game you want, search for one, view the highest rated games or browse through the carousel of random high rated (at IGDB) video games.

### Writing a review
When you enter the page of a video game, click the "Write your review here!" dropdown menu to review the game.
Fill in the information and submit. Then you will see your review on the top under "Reviews". You can give it a like, share it or edit it. Remember your e-mail and password if you ever want to edit.

### Editing a review
When you click the edit button, you will be greeted by the same parameters you used to review it. 
Fill in your email and password to crosscheck this with the database, or else it won't work. 
When you're done you can click Save Changes.

### Sharing a review
If you click the share button, it will prompt the external share screen on your device. You can then choose to copy the link or send it directly through any of the apps that come up. This feature is currently not supported by IE and Firefox, so on those browsers it will prompt a share button for Facebook, Twitter and Pinterest instead. Note that those buttons only work if the application is on a real server, as sharing links from 'localhost' are not valid. 

### Deleting a review
If you want to delete a review, press the "Delete" button in the edit menu - this also only works if you fill in your original email and password.

### Review ratings
Review ratings are based on the score of the reviews sent in. The IGDB rating will also show beside our rating, so you have more information to go on when wanting to try a game.

### Adding a game
To add a game, you can click on the "add new game to the library" button on the home page, the "add game" button on the navigation bar or the "Add it yourself" button on the search page. Fill in the form and submit it. As IGDB doesn't make it possible for us to just add games through our user authorization, this instead thanks the user for the submission, while we are waiting for IGDB to add the game themselves. 
