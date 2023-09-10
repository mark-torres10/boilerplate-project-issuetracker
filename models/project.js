/* Each project stores the corresponding issues it tracks */
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  issues_list = {
    type: [String],
    required: true,
    default: []
  }
});

const Project = mongoose.model("Project", projectSchema);
