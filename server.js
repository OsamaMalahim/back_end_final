import express from "express";
import { UploadFile, sendVidList } from "./Routes/Routes.js";
import cors from "cors";

const app = express();
app.use(cors()); // enable cors

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

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`running on PORT ${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
