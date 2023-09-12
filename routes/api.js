'use strict';
const issueController = require('../controllers/issueController');
const projectController = require('../controllers/projectController');

module.exports = function(app) {

  issueController(app);
  projectController(app);
};
