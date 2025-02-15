import DbSyncRead from "../DBSync/readSync.js";
import { spawn } from "node:child_process";
import path from "node:path";

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
