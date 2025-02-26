import fs from "node:fs/promises";
import DbSyncRead from "../DBSync/readSync.js";
import DbSyncWrite from "../DBSync/writeSync.js";
import { v4 as uuidv4 } from "uuid";
import { getThumb, getVidDetail, getAudio } from "../Utility/utility.js";
import path from "node:path";
import { fileURLToPath } from "url";

// get current directory in ES6
const __filename = fileURLToPath(import.meta.url); // Convert URL to file path
const __dirname = path.dirname(__filename); // Get directory name

//send Vid List Route
export async function sendVidList(req, res) {
  console.log("reach sendVidList");
  const dataObject = DbSyncRead();
  res.status(200).send(JSON.stringify(dataObject));
}

// upload file route
export async function UploadFile(req, res) {
  //extract file name from header
  const fileName = req.headers["x-file-name"].toLowerCase();
  console.log("file name: ", fileName);
  /**
   *  save file: use streaming the file content (no npm package)
   * using stream guarantee exact file size to be uploaded
   * and no memory issues, as the file will transferred in chunks to hdd
   */
  const filePath = path.join(__dirname, "..", `./UploadedFiles/${fileName}`);

  const fileHandle = await fs.open(filePath, "w");
  const writableStream = fileHandle.createWriteStream();
  console.log("file path is : ", filePath);

  // read write data in stream
  req.on("data", (chunk) => {
    writableStream.write(chunk);
  });

  // on end all data has been
  req.on("end", async () => {
    fileHandle.close();
    console.log("files uploaded successfully");

    // extract thump from vedio file
    try {
      const thumbPath = await getThumb({ vedioPath: filePath });
    } catch (error) {
      console.log("some error in getThubm", error);
    }

    let time = 0;
    let size = 0;
    let resolution = 0;

    // extract vedio information using ffprobe
    try {
      const vedioDetail = await getVidDetail({ vedioPath: filePath });
      time = vedioDetail.vedTime;
      size = vedioDetail.vedSize;
      resolution = vedioDetail.vedResolution;

      // print to console
      console.log(
        vedioDetail.vedTime,
        vedioDetail.vedResolution,
        vedioDetail.vedSize
      );
    } catch (error) {
      console.log("error in get vid detail", error);
    }

    let base64Image = "";
    try {
      // prepare thumb path
      const fileNameWithoutExt = path.parse(fileName).name;
      const thumbPath = path.resolve(
        __dirname,
        "..",
        "thumb",
        `${fileNameWithoutExt}.jpg`
      );
      // read thumb image file
      const dataImage = await fs.readFile(thumbPath);
      // Convert the thumb to a Base64 string to send to frontEnd
      base64Image = Buffer.from(dataImage).toString("base64");
    } catch (error) {
      console.log("error during reading thumb file and decode it", error);
    }

    // write all vedio info to file
    DbSyncWrite({
      id: uuidv4(),
      Name: fileName,
      Size: size,
      time: time,
      resolution: resolution,
      thumb: base64Image,
      audio: false,
    });

    // finally add data to log file

    res.status(200).send("okay");
  });
  req.on("error", (err) => {
    console.log(err);
    res.status(500).send(err);
  });
}

// extract audio
export async function extractAudio(req, res) {
  console.log("route extract Audio Reached");

  // extract by id
  const id = req.body.vedioId;
  console.log(id);

  try {
    const isExtracted = await getAudio(id);
    console.log("is Extracted: ", isExtracted);
    if (isExtracted) {
      res.json({ status: "OK", message: "Request successful" });
    } else {
      res.sendStatus(500);
    }
  } catch (error) {
    console.log("error in extraction audio", error);
    res.sendStatus(500);
  }
}

// download audio
export async function downloadAudio(req, res) {
  const id = req.params.id;
  console.log("reach download audio file, id: ", id);

  //prepare filePath :
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
  const filePath = path.join(
    __dirname,
    "..",
    "audio",
    `${fileNameWithoutExt}.mp3`
  );

  res.download(filePath, fileName, (err) => {
    if (err) {
      console.error("Error downloading file:", err);
      res.status(500).send("Could not download the file.");
    }
  });
}

// download vedio
export async function downloadVedio(req, res) {
  console.log("reach vedio file id address: ", req.params.id);
  //prepare filePath :
  //loop through DBSync.json (our DB) and find the vedio object
  const id = req.params.id;
  const DBfile = DbSyncRead();
  const vedios = DBfile.data;
  const vedio = vedios.find((vedio) => vedio.id == id);
  // just took first result
  console.log(vedio.Name);
  console.log(vedio.id);
  // Path to the output audio file
  const fileName = vedio.Name; // baby.mp4
  // const fileNameWithoutExt = path.parse(fileName).name; // baby
  const filePath = path.join(__dirname, "..", "UploadedFiles", fileName);

  res.download(filePath, fileName, (err) => {
    if (err) {
      console.error("Error downloading file:", err);
      res.status(500).send("Could not download the file.");
    }
  });
}
