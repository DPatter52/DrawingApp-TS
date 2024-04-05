import express from "express";
import { join } from "path";

const app = express();
const PORT = process.env.PORT || 8000;

// Serve static files from the directory where this script is located.
// This will automatically serve your index.html, JavaScript, CSS, and any other static files you have.
app.use(express.static(join(__dirname, ".")));

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/`);
});
