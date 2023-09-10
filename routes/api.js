'use strict';
const issueController = require('../controllers/issueController');

module.exports = function(app) {

  issueController(app);

};
