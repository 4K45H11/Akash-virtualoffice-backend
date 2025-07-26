const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

exports.protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //this gets the user and attaches it to the request object
    // it selects every field of the user except the password
    
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

exports.isFounder = (req, res, next) => {
  if (req.user?.role !== "Founder")
    return res.status(403).json({ message: "Access restricted to Founder" });
  next();
};

exports.isHR = (req, res, next) => {
  if (req.user?.role !== "HR")
    return res.status(403).json({ message: "Access restricted to HR" });
  next();
};

exports.isIntern = (req, res, next) => {
  if (req.user?.role !== "Intern")
    return res.status(403).json({ message: "Access restricted to Interns" });
  next();
};
