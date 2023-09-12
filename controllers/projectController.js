const express = require("express");
const bodyParser = require("body-parser");

const { createNewProject, getProject } = require("../services/projectService.js");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

module.exports = (app) => {
  app.route("/api/project/:project_name")
    // get the project name and the issues that
    // are available for that project
    .get(async (req, res) => {
      let project_name = req.params.project_name;
      if(!project_name) {
        return res.json({ error: "Missing project name" });
      const project = await getProject({ project_name });
      if(!project) {
        return res.json({ error: `Project ${project_name} doesn't exist. `});
      }
    })
    .post(async (req, res) => {
      // create a new project, if it doesn't exist.
      let project_name = req.params.project_name;
      if(!project_name) {
        return res.json({ error: "Missing project name" });
      const project = await getProject({ project_name });
      if(project) {
        return res.json(project);
      }
      const newProject = await createnewProject({ project_name });
      return res.json(newProject);
    })
    .put(async (req, res) => {
      // update the information about a project
      let project_name = req.params.project_name;
      const updates = req.body;
      if(!project_name) {
        return res.json({ error: "Missing project name" });
      }
      const project = await updateProject({ project_name, updates });
      return res.json(project);
    })
    .delete(async (req, res) => {
      // delete a project
      let project_name = req.params.project_name;
      if(!project_name) {
        return res.json({ error: "Missing project name" });
      }


      //TODO
      try {
        await deleteIssue({ _id });
        await deleteIssueFromProject({ project, issue_id: _id });
        return res.json({ result: "successfully deleted", _id: _id });
      } catch(err) {
        return res.json({ error: "could not delete", _id: _id });
      }
    })
  
}

