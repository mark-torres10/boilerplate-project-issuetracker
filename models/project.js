/* Each project stores the corresponding issues it tracks */
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  project_name: {
    type: String,
    required: true
  },
  issues_ids: {
    type: [String],
    default: []
  }
});

const Project = mongoose.model("Project", projectSchema);

module.exports = { Project };
