const express = require("express");
const cors = require("cors");
const app = express();
const taskRouter = require("./routes/tasks");
const userRouter = require("./routes/user");
require("dotenv").config();
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("TaskFlow API is running");
});

app.use("/api/tasks", taskRouter);

app.use("/users", userRouter);

connectDB();

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});

app.use(errorHandler);
