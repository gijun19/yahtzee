# Yahtzee!

The object of Yahtzee is to obtain the highest score from throwing 5 dice. The game consists of 13 rounds. In each round, you roll the dice (up to three times) and then score the roll in one of 13 categories. You must score once in each category, and once a category has been scored, it may not be changed. The score is determined by a different rule for each category. The game ends once all 13 categories have been scored.

For additional information regarding the rules of Yahtzee, please refer to the following sites:

- [Yahtzee Wikipedia Page](https://en.wikipedia.org/wiki/Yahtzee)
- [Cardgames.io Yahtzee](https://cardgames.io/yahtzee/)
- [Hasbro Classic Yahtzee Rules](https://www.hasbro.com/common/documents/dad2af551c4311ddbd0b0800200c9a66/8302F43150569047F57EB8D746BA9D86.pdf)
- [The Yahtzee! Rules Page](http://www.yahtzee.org.uk/rules.html)


## Instructions

The goal of this exercise is to create a fully functioning Yahtzee practice application that players may use to improve their Yahtzee skill. There is no need to support multiplayer functionality as this will be used purely for training purposes. 

Another developer has already completed the API portion of the application and had just started created a skeleton of the user interface before being pulled onto another project. You have been tasked with picking up where they left off and completing the application. Please refer to `mockup.pdf` for additional information regarding desired layout and functionality. In addition to the included mockup, the following requirements apply:

- The application includes up-to-date libraries for [jQuery](https://api.jquery.com/), [lodash](https://lodash.com/docs/4.17.5), [bluebird Promise Library](http://bluebirdjs.com/docs/api-reference.html), and [Bootstrap](https://getbootstrap.com/docs/4.0/getting-started/introduction/). In addition, it includes the latest version of [Font Awesome](https://fontawesome.com/). These are the only libraries you may use to complete the user interface.
- Basic styling has been provided, however, feel free to edit the SASS files as necessary. Please note that proper functionality is more important than styling in this exercise.
- Please infer recommended code styling from the existing code.
- Although the initial developer had started creating a skeleton of the user interface, you are free to make changes to organization and structure provided that you satisfy the requirements of the exercise using only the libraries provided and the finished API. 


## Project Organization

```
yahtzee/
├── lib/                 (Contains API code)
│   ├── games.js         (Contains API game functionality)
│   └── utils.js         (Contains API utilities)
├── public/              (Contains UI code)
│   ├── css/             (Contains compiled CSS, do NOT manually edit files here)
│   ├── img/             (Contains image files)
│   ├── app.js           (Contains UI application logic)
│   ├── game.js          (Contains UI game logic)
│   └── index.html       (Contains UI markup)
├── sass/                (Contains SASS styling information, automatically compiled to css)
│   ├── _dice.scss       (Contains dice styling information)
│   ├── _global.scss     (Contains global styling information)
│   ├── _scorecard.scss  (Contains scorecard styling information)
│   └── styles.scss      (Contains main SASS information)
├── mockup.pdf           (Contains UI mockup information)
├── package.json         (Contains Node.js package specifications)
├── README.md            (This README file)
└── server.js            (Contains main server logic)

```

## Getting Started

Before starting, make sure you have Node.js installed on your machine (any version 4+ should work fine). If you do not already have node installed, you can install it from:

https://nodejs.org/

Once you have node installed, you may get started developing the Yahtzee application by first installing the required npm modules by running:

```
npm install
```

Once the required npm modules are installed (you only need to run this command once), you can start the development server by running:

```
node server.js
```

Once the server is running, you can access the application at [http://localhost:3400](http://localhost:3400). Please note that in an attempt to make development easier, the development server has been setup to automatically watch the files within the source directory and live-reload the application when files are changed.


## API

The Yahtzee API has already been developed to allow you to focus on the user interface. There are three routes that you can use to perform various functions:

### 1. Create Game

**Route Signature**: `GET /api/game`

**Request Body**: `(empty)`

**Response Body**: `game` object

**Description**:

The Create Game route initializes a new game object to be used in subsequent calls to the API. The game object consists of information about the current round (including the current dice and their status) as well as the state of the scorecard (including any locked scores or potential scores given the current state of the dice). The following represents a sample game object:

```
{
    "round": {
        "turn": 1,
        "dice": [{
            "locked": false,
            "value": 2
        }, {
            "locked": false,
            "value": 5
        }, {
            "locked": false,
            "value": 6
        }, {
            "locked": false,
            "value": 1
        }, {
            "locked": false,
            "value": 2
        }]
    },
    "scorecard": [{
        "id": "ones",
        "name": "Ones",
        "description": "Get as many ones as possible. " +
            "Scores the sum of dice with the number 1.",
        "points": null,
        "locked": false,
        "type": "score"
    }, {
        "id": "twos",
        "name": "Twos",
        "description": "Get as many twos as possible. " +
            "Scores the sum of dice with the number 2.",
        "points": null,
        "locked": false,
        "type": "score"
    }, {
        "id": "threes",
        "name": "Threes",
        "description": "Get as many threes as possible. " +
            "Scores the sum of dice with the number 3.",
        "points": null,
        "locked": false,
        "type": "score"
    }, {
        "id": "fours",
        "name": "Fours",
        "description": "Get as many fours as possible. " +
            "Scores the sum of dice with the number 4.",
        "points": null,
        "locked": false,
        "type": "score"
    }, {
        "id": "fives",
        "name": "Fives",
        "description": "Get as many fives as possible. " +
            "Scores the sum of dice with the number 5.",
        "points": null,
        "locked": false,
        "type": "score"
    }, {
        "id": "sixes",
        "name": "Sixes",
        "description": "Get as many sixes as possible. " +
            "Scores the sum of dice with the number 6.",
        "points": null,
        "locked": false,
        "type": "score"
    }, {
        "id": "sum",
        "name": "Sum",
        "description": "Sum of upper section.",
        "points": null,
        "type": "summary"
    }, {
        "id": "bonus",
        "name": "Bonus",
        "description": "If the sum of all the single number combinations is 63 or more, " +
            "scores a bonus of 35 points.",
        "points": null,
        "type": "summary"
    }, {
        "id": "three-of-a-kind",
        "name": "Three of a kind",
        "description": "Get three dice with the same number. " +
            "Scores the sum of all dice (not just the three of a kind).",
        "points": null,
        "locked": false,
        "type": "score"
    }, {
        "id": "four-of-a-kind",
        "name": "Four of a kind",
        "description": "Get four dice with the same number. " +
            "Scores the sum of all dice (not just the four of a kind).",
        "points": null,
        "locked": false,
        "type": "score"
    }, {
        "id": "full-house",
        "name": "Full house",
        "description": "Get three of a kind and a pair, e.g. 1,1,3,3,3 or 3,3,3,6,6. " +
            "Scores 25 points.",
        "points": null,
        "locked": false,
        "type": "score"
    }, {
        "id": "small-straight",
        "name": "Small straight",
        "description": "Get four sequential dice, 1,2,3,4 or 2,3,4,5 or 3,4,5,6. " +
            "Scores 30 points.",
        "points": null,
        "locked": false,
        "type": "score"
    }, {
        "id": "large-straight",
        "name": "Large straight",
        "description": "Get five sequential dice, 1,2,3,4,5 or 2,3,4,5,6. Scores 40 points.",
        "points": null,
        "locked": false,
        "type": "score"
    }, {
        "id": "chance",
        "name": "Chance",
        "description": "Any combination of dice. Score the sum of all dice.",
        "points": null,
        "locked": false,
        "type": "score"
    }, {
        "id": "yahtzee",
        "name": "Yahtzee",
        "description": "Five of a kind. Scores 50 points.",
        "points": null,
        "locked": false,
        "type": "score"
    }, {
        "id": "total",
        "name": "Total",
        "description": "Total points.",
        "points": null,
        "type": "summary"
    }]
}
```

Within the game object, there are two fields, the first field, `round`, represents the state of the current round:

```
{
    "turn": 1,
    "dice": [{
        "locked": false,
        "value": 2
    }, {
        "locked": false,
        "value": 5
    }, {
        "locked": false,
        "value": 6
    }, {
        "locked": false,
        "value": 1
    }, {
        "locked": false,
        "value": 2
    }]
}
```

It stores the current `turn` within the round (may be 1, 2, or 3) as well as the state of each die (in the `dice` array). Each die stores its current `value` (1, 2, 3, 4, 5, or 6) as well as whether or not it is locked (indicating that the user wishes to "hold" the current value and not re-roll the die).

The second field, `scorecard`, stores the entire Yahtzee scorecard, which includes a total of 16 rows (13 "score" rows and 3 "summary" rows). Each row consists of an `id`, `name`, and `description` which may be used to render information about the row. Scored rows, such as the following representation of the "Large Straight" row, also indicate additional information:

```
{
    "id": "large-straight",
    "name": "Large straight",
    "description": "Get five sequential dice, 1,2,3,4,5 or 2,3,4,5,6. Scores 40 points.",
    "points": null,
    "locked": false,
    "type": "score"
}
```

Here, `points` are either the currently locked points (if `locked` is equal to `true`) or it represents the number of points that the current dice would be awarded if they were assigned to this category. Please note that a points value of `null` indicates that the current dice would receive 0 points if assigned to the category.

Summary rows, such as the following representation of the "Sum" category, does not contain any information about their locked status (since they are automatically computed):

```
{
    "id": "sum",
    "name": "Sum",
    "description": "Sum of upper section.",
    "points": null,
    "type": "summary"
}
```

In the case of "summary" rows, the `points` field indicates the currently awarded (or computed) points for the given category.


### 2. Roll Dice

**Route Signature**: `POST /api/game/roll`

**Request Body**: `game` object

**Response Body**: Updated `game` object

The Roll Dice route is used to roll all unlocked dice, thereby advancing the turn within the current round. Any die with `locked` equal to `true` will NOT be altered. Therefore, it is the  user interface's responsibility to allow the end-user to toggle the `locked` state of each die within each round. Once the user is satisfied with their selection, they "re-roll" the remaining dice and it is at that time that the user interface should `POST` the current `game` object to this route.

Please note that in addition to updating the unlocked dice values, this route will also update the projected points for all unlocked rows in the scorecard. In this way, the user interface simply needs to report the projected score for each category and is not responsible for performing scoring projections.


### 3. Select Scoring Category

**Route Signature**: `PUT /api/game/select/:id`

**Route Parameters**: `id` - Scoring category ID to which the current round should be assigned.

**Request Body**: `game` object

**Response Body**: Updated `game` object

The Select Scoring Category route is used to assign the current round to a particular scoring category. Typically this is called when the round has reached turn 3 (i.e., the user has no more rolls for the current round), however, it may be called earlier as well (if the user has already obtained the desired dice configuration). This route will first set the points to the indicated scoring category, and then set the `locked` state of that row to `true` (indicating that the points have been committed and may no longer be changed).

In addition, if there are still remaining rounds (i.e., not all scoring categories have been locked), this route will reset the current round and re-roll all dice. The game should continue until the current round is no longer reset. 
