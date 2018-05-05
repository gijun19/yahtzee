/*
 * Games
 *
 * 
 */
'use strict';

var _ = require('lodash');
var bluebird = require('bluebird');
var chance = require('chance')();

var utils = require('./utils');

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Constructor

function Games(environment, services) {
  // Routes
  this.routes = new Routes(this);
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Private methods

Games.prototype._applyScores = function(game, scores) {
  var scorecard = game.scorecard;
  for (var i = 0; i < scorecard.length; ++i) {
    var item = scorecard[i];
    if (item.type === 'score' && !item.locked) {
      var score = scores[item.id];
      if (typeof score === 'number') {
        item.points = score;
      } else {
        item.points = null;
      }
    }
  }
  return game;
};

Games.prototype._evaluateScores = function(game) {
  // Determine valid scorecard items
  var dice = game.round.dice
    .map(function(die) {
      return die.value;
    })
    .sort(function(a, b) {
      return a - b;
    });

  // Determine frequencies
  var freqs = [0, 0, 0, 0, 0, 0];
  var sum = 0;
  dice.forEach(function(dv) {
    freqs[dv - 1]++;
    sum += dv;
  });

  // Determine upper item scores
  var scores = {
    ones: freqs[0] * 1,
    twos: freqs[1] * 2,
    threes: freqs[2] * 3,
    fours: freqs[3] * 4,
    fives: freqs[4] * 5,
    sixes: freqs[5] * 6
  };

  // Compact and order frequencies
  freqs = _.compact(freqs).sort(function(a, b) {
    return a - b;
  });

  // Determine lower item scores
  if (freqs.length === 1) {
    scores.yahtzee = 50;
    scores['four-of-a-kind'] = sum;
    scores['three-of-a-kind'] = sum;
  } else if (freqs.length === 2) {
    if (freqs[0] === 2) {
      scores['full-house'] = 25;
      scores['three-of-a-kind'] = sum;
    } else {
      scores['four-of-a-kind'] = sum;
      scores['three-of-a-kind'] = sum;
    }
  } else if (freqs.length === 3 && freqs[2] === 3) {
    scores['three-of-a-kind'] = sum;
  } else if (freqs.length === 4 && utils.isSequential(_.uniq(dice))) {
    scores['small-straight'] = 30;
  } else if (freqs.length === 5 && utils.isSequential(dice)) {
    scores['large-straight'] = 40;
    scores['small-straight'] = 30;
  }

  // Always add chance
  scores.chance = sum;

  // Return scores
  return scores;
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Public methods

Games.prototype.create = function() {
  // Create game object
  var game = {
    round: {
      turn: 1,
      dice: [
        {
          locked: false,
          value: chance.d6()
        },
        {
          locked: false,
          value: chance.d6()
        },
        {
          locked: false,
          value: chance.d6()
        },
        {
          locked: false,
          value: chance.d6()
        },
        {
          locked: false,
          value: chance.d6()
        }
      ]
    },
    scorecard: [
      {
        id: 'ones',
        name: 'Ones',
        description:
          'Get as many ones as possible. ' +
          'Scores the sum of dice with the number 1.',
        points: null,
        locked: false,
        type: 'score'
      },
      {
        id: 'twos',
        name: 'Twos',
        description:
          'Get as many twos as possible. ' +
          'Scores the sum of dice with the number 2.',
        points: null,
        locked: false,
        type: 'score'
      },
      {
        id: 'threes',
        name: 'Threes',
        description:
          'Get as many threes as possible. ' +
          'Scores the sum of dice with the number 3.',
        points: null,
        locked: false,
        type: 'score'
      },
      {
        id: 'fours',
        name: 'Fours',
        description:
          'Get as many fours as possible. ' +
          'Scores the sum of dice with the number 4.',
        points: null,
        locked: false,
        type: 'score'
      },
      {
        id: 'fives',
        name: 'Fives',
        description:
          'Get as many fives as possible. ' +
          'Scores the sum of dice with the number 5.',
        points: null,
        locked: false,
        type: 'score'
      },
      {
        id: 'sixes',
        name: 'Sixes',
        description:
          'Get as many sixes as possible. ' +
          'Scores the sum of dice with the number 6.',
        points: null,
        locked: false,
        type: 'score'
      },
      {
        id: 'sum',
        name: 'Sum',
        description: 'Sum of upper section.',
        points: null,
        type: 'summary'
      },
      {
        id: 'bonus',
        name: 'Bonus',
        description:
          'If the sum of all the single number combinations is 63 or more, ' +
          'scores a bonus of 35 points.',
        points: null,
        type: 'summary'
      },
      {
        id: 'three-of-a-kind',
        name: 'Three of a kind',
        description:
          'Get three dice with the same number. ' +
          'Scores the sum of all dice (not just the three of a kind).',
        points: null,
        locked: false,
        type: 'score'
      },
      {
        id: 'four-of-a-kind',
        name: 'Four of a kind',
        description:
          'Get four dice with the same number. ' +
          'Scores the sum of all dice (not just the four of a kind).',
        points: null,
        locked: false,
        type: 'score'
      },
      {
        id: 'full-house',
        name: 'Full house',
        description:
          'Get three of a kind and a pair, e.g. 1,1,3,3,3 or 3,3,3,6,6. ' +
          'Scores 25 points.',
        points: null,
        locked: false,
        type: 'score'
      },
      {
        id: 'small-straight',
        name: 'Small straight',
        description:
          'Get four sequential dice, 1,2,3,4 or 2,3,4,5 or 3,4,5,6. ' +
          'Scores 30 points.',
        points: null,
        locked: false,
        type: 'score'
      },
      {
        id: 'large-straight',
        name: 'Large straight',
        description:
          'Get five sequential dice, 1,2,3,4,5 or 2,3,4,5,6. Scores 40 points.',
        points: null,
        locked: false,
        type: 'score'
      },
      {
        id: 'chance',
        name: 'Chance',
        description: 'Any combination of dice. Score the sum of all dice.',
        points: null,
        locked: false,
        type: 'score'
      },
      {
        id: 'yahtzee',
        name: 'Yahtzee',
        description: 'Five of a kind. Scores 50 points.',
        points: null,
        locked: false,
        type: 'score'
      },
      {
        id: 'total',
        name: 'Total',
        description: 'Total points.',
        points: null,
        type: 'summary'
      }
    ]
  };

  // Apply scores
  this._applyScores(game, this._evaluateScores(game));

  // Return game
  return game;
};

Games.prototype.roll = function(game) {
  return bluebird
    .bind(this)
    .then(function() {
      if (game.round.turn >= 3) {
        return utils.error(422, 'Only allowed 3 turns per round');
      }
      return game.round.dice;
    })
    .each(function(die) {
      if (die.locked) {
        return bluebird.resolve();
      } else {
        return bluebird.delay(20).then(function() {
          die.value = chance.d6();
        });
      }
    })
    .then(function() {
      // Increment turn
      game.round.turn++;

      // Determine valid scorecard items
      this._applyScores(game, this._evaluateScores(game));

      // Return game
      return game;
    });
};

Games.prototype.select = function(game, id) {
  return bluebird.bind(this).then(function() {
    var item = _.find(game.scorecard, ['id', id]);
    if (!item || item.type !== 'score' || item.locked) {
      return utils.error(
        422,
        'Invalid attempt to select an invalid score item'
      );
    }

    // Evaluate scores
    var scores = this._evaluateScores(game);

    // Assign score to item
    item.points = scores[id] || 0;
    item.locked = true;

    // Update summary items
    var sum = 0;
    var count = 0;
    for (var i = 0; i < 6; ++i) {
      item = game.scorecard[i];
      if (item.locked && typeof item.points === 'number') {
        sum += item.points;
        count++;
      }
    }
    if (count > 0) {
      game.scorecard[6].points = sum;
    }
    if (sum >= 63) {
      game.scorecard[7].points = 35;
      sum += 35;
    } else if (count === 6) {
      game.scorecard[7].points = 0;
    } else {
      game.scorecard[7].points = null;
    }
    for (var j = 8; j < 15; ++j) {
      item = game.scorecard[j];
      if (item.locked && typeof item.points === 'number') {
        sum += item.points;
        count++;
      }
    }
    game.scorecard[15].points = sum;

    // Reset points for unscored items
    if (count < 13) {
      game.round.turn = 0;
      for (var i = 0; i < 5; ++i) {
        game.round.dice[i].locked = false;
      }
      return this.roll(game);
    } else {
      for (var i = 0; i < 5; ++i) {
        game.round.dice[i].locked = true;
      }
      return game;
    }
  });
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Routes

function Routes(games) {
  // --------------------------------------------------
  // Route definition

  var routes = {};

  // --------------------------------------------------
  // Create

  routes.create = function(req, res) {
    bluebird
      .resolve()
      .then(function() {
        return games.create();
      })
      .then(function(game) {
        res.json(game).end();
      })
      .catch(utils.errorHandler(req, res));
  };

  // --------------------------------------------------
  // Roll

  routes.roll = function(req, res) {
    bluebird
      .resolve()
      .then(function() {
        return games.roll(req.body);
      })
      .then(function(game) {
        res.json(game).end();
      })
      .catch(utils.errorHandler(req, res));
  };

  // --------------------------------------------------
  // Select

  routes.select = function(req, res) {
    bluebird
      .resolve()
      .then(function() {
        return games.select(req.body, req.params.id);
      })
      .then(function(game) {
        res.json(game).end();
      })
      .catch(utils.errorHandler(req, res));
  };

  // --------------------------------------------------
  // Return routes

  return routes;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Exports

module.exports = Games;
