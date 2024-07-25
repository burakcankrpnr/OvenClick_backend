const jwt = require("jsonwebtoken");
const JWT_SECRET = "your_jwt_secret";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null)
    return res.status(401).json({ message: "Token is missing" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

const authenticate = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized !! Please sign in" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log(decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    return res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = {
  authenticateToken,
  authenticate,
};
