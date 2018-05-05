/*
 * Server
 *
 * 
 */

var _ = require('lodash');
var beeper = require('beeper');
var bluebird = require('bluebird');
var chalk = require('chalk');
var chokidar = require('chokidar');
var express = require('express');
var expressBodyParser = require('body-parser');
var fs = bluebird.promisifyAll(require('fs'));
var fspath = require('path');
var moment = require('moment');
var nurl = require('url');
var os = require('os');
var sass = bluebird.promisifyAll(require('node-sass'));
var serveStatic = require('serve-static');
var tinylr = require('tiny-lr');

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Live Reload

var lrport = 35729;
var lrserver = tinylr();
var lrresolve;
var lrinit = new bluebird(function(resolve, reject) {
  lrresolve = resolve;
});
lrserver.listen(lrport);

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Web Server

var Games = require('./lib/games');

var games = new Games();

var app = express();

// Middleware
app.use(
  expressBodyParser.json({
    limit: '2mb'
  })
);
app.use(
  require('connect-livereload')({
    port: lrport
  })
);

// Routes
app.get('/api/game', games.routes.create);
app.post('/api/game/roll', games.routes.roll);
app.put('/api/game/select/:id', games.routes.select);

// Fallback
app.use(function(req, res, next) {
  var parse = nurl.parse(req.url);
  var ext = fspath.extname(parse.pathname);
  if ((ext === '' || !isNaN(ext)) && req.url !== '/') {
    req.url = '/index.html';
  }
  next();
});

// Static assets
app.use('/', serveStatic('public'));

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Actions

function renderSass() {
  return sass
    .renderAsync({
      file: 'sass/styles.scss'
    })
    .then(function(result) {
      return fs.writeFileAsync('public/css/styles.css', result.css.toString());
    })
    .catch(function(err) {
      process.stdout.write(os.EOL + chalk.yellow('Sass Errors:') + os.EOL);
      process.stdout.write(err.formatted + os.EOL);
      beeper();
    });
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Watcher

var watcher = chokidar.watch(['public/**/*', 'sass/**/*', 'server.js'], {
  ignoreInitial: true
});

watcher.on('all', function(action, filepath) {
  if (action === 'addDir') {
    return;
  }

  // Log change
  console.log(filepath + ' - ' + action);

  // Initialize promise
  var p = bluebird
    .resolve()
    .then(function() {
      if (filepath.indexOf('sass') === 0) {
        return renderSass();
      }
    })
    .then(function() {
      lrserver.changed({
        body: {
          files: [filepath]
        }
      });
    });
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Initialize

bluebird
  .bind({})
  .then(function() {
    return renderSass();
  })
  .then(function() {
    app.listen(3400, function() {
      console.log(
        chalk.green('Server ready') +
          ' at ' +
          chalk.magenta('http://localhost:3400')
      );
    });
  });
