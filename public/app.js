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
	this.$dice = []; // @TODO: Repeat dice DOM elements and store for future access?

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

// @TODO: I'll come back and add any required private methods here

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

	// @TODO: Implement rendering logic for updating DOM elements, I can call this anytime things
	//        change to update the DOM elements.
};

App.prototype.rollDice = function() {
	// @TODO: This obviously needs to be implemented
};

App.prototype.selectScore = function(id) {
	// @TODO: Implement selecting a score (calling game function + updating state?)
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Initialization

var app = new App();
app.initialize();
