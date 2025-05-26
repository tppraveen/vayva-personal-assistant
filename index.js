const express = require("express");
const app = express();

const port = process.env.PORT || 3000;

app.use(express.static("public"));

app.get("/hello", (req, res) => {
  res.json({ message: "Hello from Node.js backend!" });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
