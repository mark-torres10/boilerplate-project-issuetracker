/* Manages direct access to MongoDB database */
const { Issue } = require("../models/issue.js");
const { getCurrentTimestampAsIsoString } = require("../lib/helper.js");

require('dotenv').config();
const mongoose = require("mongoose");

const MONGO_URI = process.env["MONGO_URI"];
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
console.log("connected!!");


/* MongoDB access functions */
const createNewIssue = async ({ issue_title, issue_text, created_by, assigned_to="", status_text=""}) => {
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

