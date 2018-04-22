/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Application
 *
 * Copyright (c) 2018 ProKnow, LLC. All rights reserved.
 */

function App() {
  var self = this;

  // Public members
  this.game = new Game();

  // Gather options
  this.$reset = $('#reset-game');

  // Gather buttons
  this.$roll = $('#roll');
  this.$roll.on('click', function() {
    self.rollDice();
  });

  // Gather and construct dice elements
  this.$diceBadge = $('.roll-badge');
  this.$diceContainer = $('#dice');
  this.$dieTemplate = this.$diceContainer.children('div').detach();
  this.$dice = [];
  this.$diceContainer.on('click', 'div.die', function() {
    self.toggleDiceLock(
      $(this)
        .closest('div')
        .data('index')
    );
  });

  // Gather scorecard elements
  this.$scorecard = $('#scorecard');
  this.$scorecardBody = this.$scorecard.children('tbody');
  this.$scorecardRowTemplate = this.$scorecardBody.children('tr').detach();
  this.$scorecardRows = [];
  this.$scorecard.on('click', 'button', function() {
    self.selectScore(
      $(this)
        .closest('tr')
        .attr('id')
    );
  });
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Private methods

App.prototype._resetDice = function() {
  this.$dice = [];
  this.$diceContainer.empty();
};

App.prototype._renderScorecardData = function() {
  // Get the scorecard returned from the API.
  var scorecard = this.game.data.scorecard;

  // Iterate over each already generated row and apply scorecard values.
  $(this.$scorecardRows).each(function(index, $row) {
    $row.children('.score').text(scorecard[index].points);
  });
};

App.prototype._renderDiceData = function() {
  // Dynamically create the dice elements using values returned from Game object.
  var dice = this.game.data.round.dice;

  for (var i = 0; i < dice.length; ++i) {
    var current = dice[i];

    // Construct dice from template.
    var $die = this.$dieTemplate.clone();
    var className = $die.attr('class');
    $die[0].dataset.index = i;
    $die.attr('value', current.value);
    // Set class for dice images.
    $die
      .children()
      .removeClass()
      .addClass('die-icon d' + current.value);

    // Append die to the dice container and add to dice array.
    this.$diceContainer.append($die);
    this.$dice.push($die);
  }
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Public methods

App.prototype.initialize = function() {
  return Promise.bind(this)
    .then(function() {
      return this.game.initialize();
    })
    .then(function() {
      // Dynamically create scorecard elements
      var scorecard = this.game.data.scorecard;
      for (var i = 0; i < scorecard.length; ++i) {
        var item = scorecard[i];

        // Construct row from template
        var $row = this.$scorecardRowTemplate.clone();
        $row[0].dataset.index = i;
        $row.attr('id', item.id);
        $row.children('.name').text(item.name);
        if (item.type === 'summary') {
          $row.addClass('table-secondary');
        }

        // Append row to body and add to rows
        this.$scorecardBody.append($row);
        this.$scorecardRows.push($row);
      }

      // Render application
      this.render();
    });
};

App.prototype.render = function() {
  if (!this.game.data) {
    return;
  }

  // Clean if there's existing data.
  if (this.$dice.length) {
    this._resetDice();
  }

  // Update DOM
  this._renderDiceData();
  this._renderScorecardData();
};

App.prototype.rollDice = function() {
  return Promise.bind(this)
    .then(function() {
      // API call for new data via game object.
      return this.game.rollDice();
    })
    .then(function() {
      // Once new dice values are received, update DOM.
      this.render();
    })
    .catch(function(err) {
      console.log(err);
    });
};

App.prototype.selectScore = function(id) {
  // @TODO: Implement selecting a score (calling game function + updating state?)
};

App.prototype.toggleDiceLock = function(index) {
  var $die = this.$dice[index];
  var dieData = this.game.data.round.dice[index];
  $die.toggleClass('locked');
  dieData.locked = !dieData.locked;
};

App.prototype.reset = function() {
  if (!this.game.data) {
    return;
  }
  this.initialize();
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Initialization

var app = new App();
app.initialize();
