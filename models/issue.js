const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  issue_title: {
    type: String,
    required: true
  },
  issue_text: {
    type: String,
    required: true
  },
  created_on: String,
  updated_on: String,
  created_by: {
    type: String,
    required: true
  },
  assigned_to: {
    type: String,
    required: false
  },
  open: {
    type: Boolean,
    default: true
  },
  status_text: {
    type: String,
    required: false
  }
})

const Issue = mongoose.model("Issue", issueSchema);

module.exports = { Issue };
