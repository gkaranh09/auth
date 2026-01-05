import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoute from "./routes/auth.rout.js";
import connectDb from "./db/connectdb.js";
import cors from "cors";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
connectDb();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoute);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
