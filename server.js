import express from "express";
import { UploadFile, sendVidList, extractAudio, downloadAudio } from "./Routes/Routes.js";

import cors from "cors";

const app = express();
app.use(cors()); // enable cors

// Middleware to parse JSON data
app.use(express.json());

const PORT = 5112;

// send all vid list
app.get("/", async (req, res) => {
  console.log("route / targeted !");
  await sendVidList(req, res);
});

// upload a file
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
  await downloadAudio(req,res); 
});

// Graceful shutdown
process.on("SIGINT", () => {
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
