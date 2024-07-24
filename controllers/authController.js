const jwt = require("jsonwebtoken");
const db = require("../config/database");

const JWT_SECRET = "your_jwt_secret";

const register = (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.json({ error: "All fields are required" });
  }

  const userCheckSql = "SELECT * FROM user WHERE username = ? OR email = ?";
  db.query(userCheckSql, [username, email], (err, result) => {
    if (err) {
      console.error("Error checking user existence:", err);
      return res.send("Server error");
    }

    if (result.length > 0) {
      return res.send("Username or email already exists");
    }

    const hashedPassword = password;

    const registerSql =
      "INSERT INTO user (username, password, email) VALUES (?, ?, ?)";
    db.query(registerSql, [username, hashedPassword, email], (err, result) => {
      if (err) {
        console.error("Error creating user:", err);
        return res.send("Server error");
      }

      res.status(201).send("User registered successfully");
    });
  });
};

const login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  const sql = "SELECT * FROM user WHERE username = ?";
  db.query(sql, [username], (err, result) => {
    if (err) {
      console.error("Error fetching user:", err);
      return res.status(500).send("Server error");
    }

    if (result.length === 0) {
      return res.send("Invalid username or password");
    }

    const user = result[0];

    if (password !== user.password) {
      return res.send("Invalid username or password");
    }

    const token = jwt.sign(
      { id: user.user_id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  });
};

module.exports = {
  register,
  login,
};
