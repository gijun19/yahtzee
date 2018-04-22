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
  this.$reset.on('click', function() {
    self.reset();
  });

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
  this.$diceContainer.on('click', '.die-icon', function() {
    self.toggleDiceLock(
      $(this)
        .closest('.die')
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

// Gather detail elements.
this.$roundNumber = $('#roundNumber');

// Gather loading mask
this.$loadingMask = $('#loadingMask');

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Private methods
App.prototype._shouldUpdate = function() {};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Public methods

App.prototype.initialize = function() {
  // Use initialize to render app template.
  return Promise.bind(this)
    .then(function() {
      return this.game.initialize();
    })
    .then(function() {
      // Dynamically create scorecard elements
      var scorecard = this.game.data.scorecard;
      console.log(scorecard);
      for (var i = 0; i < scorecard.length; ++i) {
        var item = scorecard[i];

        // Construct row from template
        var $row = this.$scorecardRowTemplate.clone();
        $row[0].dataset.index = i;
        $row.attr('id', item.id);
        $row.children('.name').text(item.name);
        if (item.type === 'summary') {
          $row.addClass('table-secondary');

          $row.children('.score').addClass('font-weight-bold text-primary'); // Add font weight and color for score
          $row.find('.actions button').hide(); // Remove button for score column, bad UX.
        }

        // Append row to body and add to rows
        this.$scorecardBody.append($row);
        this.$scorecardRows.push($row);
      }

      // Dynamically create dice elements.
      var dice = this.game.data.round.dice;
      for (var i = 0; i < dice.length; ++i) {
        var item = dice[i];

        // Construct dice from template.
        $die = this.$dieTemplate.clone();
        $die[0].dataset.index = i;

        // Append die templates to dice container and store die in array for future usage.
        this.$diceContainer.append($die);
        this.$dice.push($die);
      }

      // Render application
      this.render();
    });
};

App.prototype.render = function() {
  // Update the DOM.
  if (!this.game.data) {
    return;
  }

  // Update die templates with values from API call.
  var dice = this.game.data.round.dice;

  $(this.$dice).each(function(index, $die) {
    var current = dice[index];

    // Update class name if value has changed.
    var className = 'die-icon d' + current.value;
    var currentClass = $die.children().attr('class');
    if (className !== currentClass) {
      $die
        .children()
        .removeClass()
        .addClass('die-icon d' + current.value);
    }

    // Update die value if value has changed.
    if ($die.attr('value') !== current.value) {
      $die.attr('value', current.value);
    }

    // Update locked if value has changed.
    if (current.locked && !$die.hasClass('locked')) {
      $die.addClass('locked');
    } else if (!current.locked && $die.hasClass('locked')) {
      $die.removeClass('locked');
    }
  });

  // Update score table with values.
  var scorecards = this.game.data.scorecard;

  // Map through scorecard rows, and update values at specified index.
  $(this.$scorecardRows).each(function(index, $row) {
    var current = scorecards[index];
    var $score = $row.children('.score');
    $score.text(current.points);

    if (current.locked) {
      $row.find('.actions > button').hide();
      $score.addClass('font-weight-bold');
    }
  });
};

App.prototype.rollDice = function() {
  return Promise.bind(this)
    .then(function() {
      // API call for new data via game object.
      return this.game.rollDice();
    })
    .then(function() {
      // Update DOM.
      this.render();
    })
    .catch(function(err) {
      console.log(err);
    });
};

App.prototype.selectScore = function(id) {
  return Promise.bind(this)
    .then(function() {
      // API call via game object.
      return this.game.selectScore(id);
    })
    .then(function() {
      // Update DOM.
      this.render();
    });
};

App.prototype.toggleDiceLock = function(index) {
  var die = this.game.data.round.dice[index];
  die.locked = !die.locked;
  this.render();
};

App.prototype.reset = function() {
  var self = new App();
  console.log(self);
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Initialization

var app = new App();
app.initialize();
