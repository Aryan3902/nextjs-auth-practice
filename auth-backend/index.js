const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET = "your_jwt_secret"; // Store this securely in an environment variable

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

// Middleware to protect routes
const authMiddleware = (req, res, next) => {
  const userCookie = JSON.parse(req.cookies.user);
  if (!userCookie) return res.status(401).json({ message: "Unauthorized" });
  const token = userCookie.token;

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid Token" });
    req.user = decoded; // Attach decoded user info to request
    next();
  });
};

// Register route
app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;
  const data = fs.readFileSync("credentials.json", "utf-8");
  const allUsers = JSON.parse(data).users;

  if (allUsers.find((user) => user.email === email))
    return new Error("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  allUsers.push({ email, password: hashedPassword });
  const usersJSON = JSON.stringify({ users: allUsers });

  fs.writeFileSync("credentials.json", usersJSON, "utf-8");
  const token = jwt.sign({ email }, SECRET, { expiresIn: "1h" });

  // Set JWT as HttpOnly cookie
  res.cookie(
    "user",
    JSON.stringify({ token, expiresAt: Date.now() + 3600000 }),
    { httpOnly: true }
  );
  res.status(201).json({ email, expiresAt: Date.now() + 3600000 });
});

// Login route
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  const data = fs.readFileSync("credentials.json", "utf-8");
  const allUsers = JSON.parse(data).users;
  const user = allUsers.find((user) => user.email === email);

  if (!user) return res.status(404).json({ message: "User not found" });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword)
    return res.status(400).json({ message: "Invalid credentials" });

  // Generate JWT
  const token = jwt.sign({ email: user.email }, SECRET, { expiresIn: "1h" });

  // Set JWT as HttpOnly cookie
  res.cookie(
    "user",
    JSON.stringify({ token, expiresAt: Date.now() + 3600000 }),
    { httpOnly: true }
  );
  res.json({ email });
});

// Logout route
app.post("/api/logout", (req, res) => {
  res.clearCookie("user", { httpOnly: true });
  res.json({ message: "Logged out successfully" });
});

// Protected route
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
