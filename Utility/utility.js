import DbSyncRead from "../DBSync/readSync.js";
import { spawn } from "node:child_process";
import path from "node:path";
import { updateAudioStatus } from "./utility2.js";

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url); // Convert URL to file path
const __dirname = dirname(__filename); // Get directory name

// Thumb saved in .jpg format same vedio file name
// command :
// ffmpeg -ss 00:00:18 -i s2.mpeg -vframes 1 -q:v 2 ./thumb/s2.jpg
export async function getThumb({ vedioPath }) {
  console.log("inside get thumb");

  // prepare data
  console.log("file path is: ", vedioPath);
  const fileName = path.basename(vedioPath);
  const fileNameWithoutExt = path.parse(fileName).name;

  return new Promise((resolve, reject) => {
    const output = path.resolve(
      __dirname,
      "..",
      "thumb",
      `${fileNameWithoutExt}.jpg`
    );
    console.log("output", output);

    const thumbnailTime = "00:00:05";
    const ffmpegArgs = [
      "-loglevel",
      "error",
      "-i",
      vedioPath,
      "-ss",
      thumbnailTime,
      "-vframes",
      "1",
      "-q:v",
      "2",
      output,
      "-y",
    ];

    const ffmpeg = spawn("ffmpeg", ffmpegArgs);

    ffmpeg.stderr.on("data", (data) => {
      console.log(data.toString());
    });

    ffmpeg.on("exit", () => {
      console.log(`thumb generated successfully`);
      resolve(output);
    });
  });
}

// vedio details, main concern is resolution
export async function getVidDetail({ vedioPath }) {
  console.log("inside get get Vid Detail");

  let vedTime = 0;
  let vedResolution = "";
  let vedSize = 0;

  return new Promise((resolve, reject) => {
    // Spawn ffprobe process
    const ffprobe = spawn("ffprobe", [
      "-v",
      "quiet", // Suppress unnecessary logs
      "-print_format",
      "json", // Output in JSON format
      "-show_format", // Show format information
      "-show_streams", // Show stream information
      vedioPath, // Input video file
    ]);

    let stdoutData = "";

    // Collect data from stdout
    ffprobe.stdout.on("data", (data) => {
      stdoutData += data.toString();
    });

    // Handle process completion
    ffprobe.on("close", (code) => {
      if (code !== 0) {
        console.error(`ffprobe process exited with code ${code}`);
        return;
      }

      // Parse the JSON output
      const metadata = JSON.parse(stdoutData);

      // Log video metadata
      vedTime = parseInt(metadata.format.duration);

      // vedio file size
      vedSize = parseInt(metadata.format.size);

      // Resolution
      vedResolution = `${metadata.streams[0].width}x${metadata.streams[0].height}`;

      console.log("vedio time : ", vedTime);
      console.log("vedio resolution: ", vedResolution);

      resolve({
        vedTime: vedTime,
        vedResolution: vedResolution,
        vedSize: vedSize,
      });
    });

    // Handle errors
    ffprobe.on("error", (err) => {
      console.error("Error spawning ffprobe:", err);
    });
  });
}

export async function getAudio(id) {
  console.log("Audio Extraction Begin ...");

  //loop through DBSync.json (our DB) and find the vedio object
  const DBfile = DbSyncRead();
  const vedios = DBfile.data;

  const vedio = vedios.filter((vedio) => vedio.id == id);
  // just took first result
  console.log(vedio[0].Name);
  console.log(vedio[0].id);

  // Path to the output audio file
  const fileName = vedio[0].Name; // baby.mp4
  const fileNameWithoutExt = path.parse(fileName).name; // baby
  const outputAudioPath = path.join(
    __dirname,
    "..",
    "audio",
    `${fileNameWithoutExt}.mp3`
  );

  // Path to vedio file
  const vedioPath = path.join(__dirname, "..", "UploadedFiles", fileName);

  return new Promise((resolve, reject) => {
    // Spawn an ffmpeg process
    const ffmpeg = spawn("ffmpeg", [
      "-y", // Overwrite output files without asking
      "-i",
      vedioPath, // Input file
      "-q:a",
      "0", // Audio quality (0 is the best)
      "-map",
      "a", // Map only the audio stream
      "-loglevel",
      "quiet", // Suppress all log output
      outputAudioPath, // Output file
    ]);

    // Handle ffmpeg output
    ffmpeg.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
    });

    ffmpeg.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    ffmpeg.on("close", (code) => {
      if (code === 0) {
        console.log("Audio extraction completed successfully.");
        // change audio extraction to true in our DB
        updateAudioStatus(id);
        resolve(true);
      } else {
        console.error(`ffmpeg process exited with code ${code}`);
        reject();
      }
    });

    ffmpeg.on("error", (err) => {
      console.error("Failed to start subprocess:", err);
    });
  }); //end promise
}
