/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Game
 */

function Game() {
	this.data = null;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Public methods

Game.prototype.initialize = function() {
	return Promise.bind(this)
		.then(function() {
			// Check for previously saved data.
			var savedData = this.getData();
			if (savedData) {
				return savedData;
			}
			// Get new game from API
			return $.ajax({
				method: 'GET',
				url: '/api/game',
			});
		})
		.then(function(res) {
			this.data = res;
		});
};

Game.prototype.rollDice = function() {
	// Roll dice via API.
	return Promise.bind(this)
		.then(function() {
			return $.ajax({
				method: 'POST',
				contentType: 'application/json',
				url: '/api/game/roll',
				data: JSON.stringify(this.data),
			});
		})
		.then(function(res) {
			this.data = res;
		});
};

Game.prototype.selectScore = function(id) {
	console.log(id);
	// Select a particular score via API.
	return Promise.bind(this)
		.then(function() {
			// Pass game in req.body & id in req.params
			return $.ajax({
				method: 'PUT',
				contentType: 'application/json',
				url: '/api/game/select/' + id,
				data: JSON.stringify(this.data),
			});
		})
		.then(function(res) {
			this.data = res;
		});
};

Game.prototype.storeData = function() {
	var data = JSON.stringify(this.data);
	localStorage.setItem('game', data);
};

Game.prototype.getData = function() {
	var data = localStorage.getItem('game');
	return JSON.parse(localStorage.getItem('game'));
};

Game.prototype.clearSavedData = function() {
	localStorage.removeItem('game');
};
