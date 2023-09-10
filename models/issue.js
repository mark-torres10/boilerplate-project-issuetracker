const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  issue_title: String,
  issue_text: String,
  created_on: String,
  updated_on: String,
  created_by: String,
  assigned_to: String,
  open: Boolean,
  status_text: String
})

const Issue = mongoose.model("Issue", issueSchema);

module.exports = Issue;
