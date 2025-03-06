import express from "express";
import {
  UploadFile,
  sendVidList,
  extractAudio,
  downloadAudio,
  downloadVedio,
  resizeVedio,
} from "./Routes/Routes.js";
import path from "node:path";
import { fileURLToPath } from "url";
// get current directory in ES6
const __filename = fileURLToPath(import.meta.url); // Convert URL to file path
const __dirname = path.dirname(__filename); // Get directory name
import cors from "cors";

const app = express();
app.use(cors()); // enable cors

// Middleware to parse JSON data
app.use(express.json());

// Serve the "thumb" folder as a static directory
//The images will now be accessible at http://localhost:5112/thumb/filename.jpg.
app.use("/thumb", express.static(path.join(__dirname, "thumb")));

const PORT = 5112;

// send all vid list
app.get("/", async (req, res) => {
  console.log("route / targeted !");
  await sendVidList(req, res);
});

// upload a vedio file
app.post("/uploadFile", async (req, res) => {
  console.log("route /uploadFile targeted !");
  await UploadFile(req, res);
});

// extract audio
app.post("/extractAudio", async (req, res) => {
  await extractAudio(req, res);
});

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`running on PORT ${PORT}`);
});

//downlaod audio file
app.get("/:id", async (req, res) => {
  console.log("hit audio download");
  await downloadAudio(req, res);
});

//downlaod vedio file
app.get("/vedio/:id", async (req, res) => {
  await downloadVedio(req, res);
});

//resize vedio
app.post("/api/resizeVideo", async (req, res) => {
  await resizeVedio(req,res);  
});

// Graceful shutdown
process.on("SIGINT", () => {
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
