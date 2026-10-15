const express = require("express");
const cors = require("cors");
const app = express();
const taskRouter = require("./routes/tasks");
const userRouter = require("./routes/user");
require("dotenv").config();
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const PORT = process.env.PORT || 5000;
const allowedOrigins = [
    "http://localhost:5173",
    process.env.FRONTEND_URL
];

app.use(cors({
    origin: allowedOrigins,
}));

app.use(express.json());

app.get("/", (req, res) => {
    res.send("TaskFlow API is running");
});

app.use("/api/tasks", taskRouter);

app.use("/users", userRouter);

connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use(errorHandler);
