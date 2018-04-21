/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Game
 *
 * Copyright (c) 2018 ProKnow, LLC. All rights reserved.
 */

function Game() {
  this.data = null;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Public methods

Game.prototype.initialize = function() {
  return Promise.bind(this)
    .then(function() {
      // Get new game from API
      return $.ajax({
        method: 'GET',
        url: '/api/game'
      });
    })
    .then(function(res) {
      this.data = res;
      console.log(this.data);
    });
};

Game.prototype.rollDice = function() {
  return Promise.bind(this)
    .then(function() {
      var game = JSON.stringify(this.data);
      console.log(game);
      return $.ajax({
        method: 'POST',
        contentType: 'application/json',
        url: '/api/game/roll',
        data: game
      });
    })
    .then(function(res) {
      console.log(res);
    });
};

Game.prototype.selectScore = function(id) {
  // @TODO: Implement selecting a particular score (via API)
};
