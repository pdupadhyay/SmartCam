const express = require("express");
require('dotenv').config()
const cors = require("cors");
const auth = require("./routes/auth");
const admin = require("./routes/admin");
const faculty = require("./routes/faculty");
const db = require("./config/connection")
const path = require('path');

const PORT = process.env.PORT || 5050;
const app = express();

db()
app.use(cors());
app.use(express.json());

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/auth", auth);
// app.use("/api/admin", admin);
app.use('/api/faculty', faculty);


// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
