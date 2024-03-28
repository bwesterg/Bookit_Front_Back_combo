import express, { Request, Response } from 'express';
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import userRoutes from './routes/users';
import authRoutes from "./routes/auth";
import cookieParser from "cookie-parser";
import path from "path";

mongoose
.connect(process.env.MONGODB_CONNECTION_STRING as string)
.then(() => console.log(
  "Connected to mongo database: ", 
  // process.env.MONGODB_CONNECTION_STRING
));

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.get("/api/test", async (req: Request, res: Response) => {
  res.json({ message: "ayo from express endpoint" });
});

//deploying frontend and backend together
app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.listen(8000, () => {
  console.log("server up and running on localhost:8000");
});