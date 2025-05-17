import express from "express";
import cors from "cors";
import { config } from "dotenv";
import translationRoutes from "./routes/translationRoutes.js";
import connectDB from "./db/connect.js";

config();

const app = express();
app.use(
  cors({
    origin: "https://languagetranslatorjson.netlify.app",
    credentials: true,
  })
);
app.use(express.json());

app.use("/api", translationRoutes);

const PORT = process.env.PORT || 5001;

async function start() {
  try {
    await connectDB(process.env.MONGO_URL);
    console.log("✅ DB Connected");
    app.listen(PORT, console.log(`Server Listening on port: http://localhost:${PORT}`));
  } catch (error) {
    console.error("❌ DB Error", error);
  }
}

start();