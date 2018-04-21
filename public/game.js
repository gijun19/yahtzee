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
        method: "GET",
        url: "/api/game"
      });
    })
    .then(function(res) {
      this.data = res;
    });
};

Game.prototype.rollDice = function() {
  // @TODO: Implement rolling unlocked dice (via API)
  //
  return $.ajax({
    method: "GET",
    url: "/api/game"
  });
};

Game.prototype.selectScore = function(id) {
  // @TODO: Implement selecting a particular score (via API)
};
