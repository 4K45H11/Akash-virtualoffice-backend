const Department = require("../models/Department.model");
const Project = require("../models/Project.model");

exports.createDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;
    const existing = await Department.findOne({ name });
    if (existing) return res.status(400).json({ message: "Department already exists" });

    const dept = await Department.create({ name, description });
    res.status(201).json(dept);
  } catch (err) {
    res.status(500).json({ message: "Error creating department", error: err.message });
  }
};

exports.createProject = async (req, res) => {
  try {
    const { title, department, description, deadline } = req.body;

    const project = await Project.create({
      title,
      department,
      description,
      deadline
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: "Error creating project", error: err.message });
  }
};
