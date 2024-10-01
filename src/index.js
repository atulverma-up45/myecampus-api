import express from "express";
import { connectToDatabase } from "./config/database/connectToDB.js";

const app = express();
const PORT = process.env.PORT;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// health route
app.get("/", (req, res) => {
  res.json({
    status: 200,
    message: "myecampus api server is up sir",
  });
});

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://127.0.0.1:${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error occurred while MySQL connection: ", error);
    process.exit(0); 
  });