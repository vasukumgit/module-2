const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

//  console.log("AUTH HEADER:", authHeader); // ADD THIS

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secretkey"
    );

    req.user = { id: decoded.id }; // ✅ CLEAN STRUCTURE

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};