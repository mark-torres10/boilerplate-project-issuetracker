const express = require("express");
const bodyParser = require("body-parser");

const { createNewProject, deleteProject, getProject, updateProject } = require("../services/projectService.js");

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
      }
      const project = await getProject({ project_name });
      if(!project) {
        return res.json({ error: `Project ${project_name} doesn't exist.` });
      }
      return res.json(project); // Send the project details in the response
    })
    .post(async (req, res) => {
      // create a new project
      let project_name = req.params.project_name;
      if(!project_name) {
        return res.json({ error: "Missing project name" });
      }
      const project = await getProject({ project_name, throw_error: false });
      if(project) {
        console.log(`Project with name ${project_name} already exists. Returning existing project.`);
        return res.json(project);
      } else {
        const newProject = await createNewProject({ project_name });
        return res.json(newProject);        
      }
    })
    .put(async (req, res) => {
      let project_name = req.params.project_name;
      const updates = req.body;
      if(!project_name) {
        return res.json({ error: "Missing project name" });
      }
      const project = await updateProject({ project_name, updates });
      return res.json(project);
    })
    .delete(async (req, res) => {
      let project_name = req.params.project_name;
      if(!project_name) {
        return res.json({ error: "Missing project name" });
      }
      const project = await getProject({ project_name });
      if(!project) {
        return res.json({ error: `Project ${project_name} doesn't exist. `});
      }
      try {
        await deleteProject({ project_name });
        return res.json({ result: "successfully deleted project", project_name });
      } catch(err) {
        return res.json({ error: `could not delete project ${project_name}`, err });
      }
    });
}

