const Project = require("../models/Project.model");
const User = require("../models/User.model");

exports.enrollInProject = async (req, res) => {
  try {
    const userId = req.user._id;
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    
    if (!project.assignedUsers.includes(userId)) {
      project.assignedUsers.push(userId);
      await project.save();
    }

    const user = await User.findById(userId);
    if (!user.currentProjects.includes(projectId)) {
      user.currentProjects.push(projectId);
      await user.save();
    }

    res.status(200).json({ message: "Enrolled successfully", project });
  } catch (err) {
    res.status(500).json({ message: "Error enrolling", error: err.message });
  }
};
