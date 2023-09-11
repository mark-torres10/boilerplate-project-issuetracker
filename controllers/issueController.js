const express = require("express");
const bodyParser = require('body-parser');

const { createNewIssue, deleteIssue, updateIssue } = require("../services/issueService.js");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* handles business logic, will be imported into api.js */

module.exports = (app) => {
  app.route('/api/issues/:project')

    //  You can send a GET request to /api/issues/{projectname} for an array of all issues for that specific projectname, with all the fields present for each issue.
    // You can send a GET request to /api/issues/{projectname} and filter the request by also passing along any field and value as a URL query (ie. /api/issues/{project}?open=false). You can pass one or more field/value pairs at once.
    .get(function(req, res) {
      let project = req.params.project;

    })

    // [DONE] You can send a POST request to /api/issues/{projectname} with form data containing the required fields issue_title, issue_text, created_by, and optionally assigned_to and status_text.
    // [DONE] The POST request to /api/issues/{projectname} will return the created object, and must include all of the submitted fields. Excluded optional fields will be returned as empty strings. Additionally, include created_on (date/time), updated_on (date/time), open (boolean, true for open - default value, false for closed), and _id.
    // [DONE] If you send a POST request to /api/issues/{projectname} without the required fields, returned will be the error { error: 'required field(s) missing' }
    .post(async (req, res) => {
      let project = req.params.project;
      let { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;

      /* Required fields need to be provided */
      if (!issue_title || !issue_text || !created_by) {
        res.json({ error: "required field(s) missing." });
      } else {
        if (!assigned_to) {
          assigned_to = "";
        }

        if (!status_text) {
          status_text = "";
        }

        /* Create new issue */
        const newIssue = await createNewIssue({ issue_title, issue_text, created_by, assigned_to, status_text });

        res.json(newIssue);
      }
    })

    // You can send a PUT request to /api/issues/{projectname} with an _id and one or more fields to update. On success, the updated_on field should be updated, and returned should be {  result: 'successfully updated', '_id': _id }.
    // When the PUT request sent to /api/issues/{projectname} does not include an _id, the return value is { error: 'missing _id' }.
    // When the PUT request sent to /api/issues/{projectname} does not include update fields, the return value is { error: 'no update field(s) sent', '_id': _id }. On any other error, the return value is { error: 'could not update', '_id': _id }.
    .put(function(req, res) {
      let project = req.params.project;
      const _id = req.body._id;
      const updates = req.body;

      // if ID not provided, return missing response
      if (!_id) {
        return res.json({ error: "missing _id" });
      }

      // if there's nothing to update, return missing response
      if (Object.keys(updates).length === 1) {
        return res.json({ error: "no update field(s) sent", _id: _id });
      }

      try {
        await updateIssue({ _id, updates });
      } catch (err) {
        return res.json({ error: "could not update", _id: _id });
      }

    })

    // You can send a DELETE request to /api/issues/{projectname} with an _id to delete an issue. If no _id is sent, the return value is { error: 'missing _id' }. On success, the return value is { result: 'successfully deleted', '_id': _id }. On failure, the return value is { error: 'could not delete', '_id': _id }.
    .delete(function(req, res) {
      let project = req.params.project;
      const _id = req.body._id;

      // if ID not provided, return missing response
      if (!_id) {
        return res.json({ error: "missing _id" });
      }

      try {
        await deleteIssue({ _id });
        return res.json({ result: "successfully deleted", _id: _id });
      } except(err) {
        return res.json({ error: "could not delete", _id: _id });
      }
    });
}