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

Game.prototype.rollDice = function() {};

Game.prototype.selectScore = function(id) {
  // @TODO: Implement selecting a particular score (via API)
};
