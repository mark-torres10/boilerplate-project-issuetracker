/* Manages direct access to MongoDB database */
const { Issue } = require("../models/issue.js");
const { getCurrentTimestampAsIsoString } = require("../lib/helper.js");

require('dotenv').config();
const mongoose = require("mongoose");

const MONGO_URI = process.env["MONGO_URI"];
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
console.log("connected!!");


/* MongoDB access functions */
const createNewIssue = async ({ issue_title, issue_text, created_by, assigned_to = "", status_text = "" }) => {
  const currentTimestampIsoString = getCurrentTimestampAsIsoString();

  const newIssue = new Issue({
    issue_title,
    issue_text,
    created_on: currentTimestampIsoString,
    updated_on: currentTimestampIsoString,
    created_by,
    assigned_to,
    open: true,
    status_text
  });

  await newIssue.save();
  return newIssue;
}

const updateIssue = async({ _id, updates }) => {
  let updatedIssue = await Issue.findOneAndUpdate({ _id }, updates, { new: true });
  if(!updatedIssue){
    console.error(`Cannot find issue with _id=${_id}`);
    throw new Error("Could not update, cannot find issue.")
  }
  await updatedIssue.save();
  return updatedIssue;
}

const getIssues = async({ filters={} }) => {
  let issuesToGet = await Issue.find(filters);
  return issuesToGet;
}

const deleteIssue = async({ _id }) => {
  let deletedIssue = await Issue.findByIdAndRemove(_id);
  if(!deletedIssue) {
    console.error(`Cannot find issue with _id=${_id}`);
    throw new Error("Could not delete, cannot find issue.")
  } 
}

module.exports = { createNewIssue, deleteIssue, getIssues, updateIssue }
