/* Manages creation of Project objects */
const { Issue } = require("../models/issue.js");
const { Project } = require("../models/project.js");

const getProject = async({ project_name, throw_error=true }) => {
  const project = await Project.findOne({ project_name });
  if(!project && throw_error){
    throw new Error(`Could not find project with name=${project_name}`);
  }
  return project;
}

const createNewProject = async({ project_name }) => {
  const existingProject = await getProject({ project_name });
  if(!existingProject) {
    const newProject = new Project({ project_name });
    await newProject.save();
    return newProject; 
  }
}

const updateProject = async({ project_name, updates }) => {
  let updatedProject = await Project.findOneAndUpdate({ project_name }, updates, { new: true });
  if(!updatedProject) {
    console.error(`Cannot find project with name=${project_name}`);
    throw new Error("Could not update, cannot find project.")
  }
  await updatedProject.save();
  return updatedProject;
}

const deleteProject = async({ project_name }) => {
  let deletedProject = await Project.findAndRemove({ project_name });
  if(!deletedProject) {
    console.error(`Cannot find project with name=${project_name}`);
    throw new Error("Could not delete, cannot find project.")
  } 
}

const getIssuesInProject = async({ project, filters }) => {
  const issues = await Promise.all(
    project.issue_ids.map(async (issue_id) => {
      return await Issue.findOne({ _id: issue_id, ...filters });
    })
  );
  return issues;
}

const addIssueToProject = async({ project, issue_id }) => {
  project.issue_ids.push(issue_id);
  await project.save();
  return project;
}

const deleteIssueFromProject = async( { project, issue_id }) => {
  let filteredIssueIds = project.issue_ids.filter((id) => id != issue_id);
  project.issue_ids = filteredIssueIds;
  await project.save();
  return project;
}

module.exports = { addIssueToProject, createNewProject, deleteIssueFromProject, deleteProject, getIssuesInProject, getProject, updateProject };