import fs from "node:fs/promises";
// import addVidDetail from "../UploadedFiles/vedio-log.js";
import DbSyncWrite from "../DBSync/writeSync.js";
import { v4 as uuidv4 } from "uuid";
import { getThumb, getVidDetail } from "../Utility/utility.js";
import { resolve } from "node:path";

// upload file route, save file data ....
export async function UploadFile(req, res) {
  //extract file name from header
  const fileName = req.headers["file-name"];

  // streaming the file content
  const fileHandle = await fs.open(`./UploadedFiles/${fileName}`, "w");
  const writableStream = fileHandle.createWriteStream();

  req.on("data", (chunk) => {
    writableStream.write(chunk);
  });
  req.on("end", () => {
    fileHandle.close();
  });
  req.on("end", async () => {
    // save file name and size
    // const fileName = req.headers["file-name"];
    const fileSize = req.headers["content-length"] / (1024 * 1024);

    try {
      // extract thump from vedio file
      const thumbPath = await getThumb({
        vedUrl: `./UploadedFiles/${fileName}`,
      });
      if (thumbPath) {
        console.log("thumb generated ok");
      }

      // extract file details
      const vidDetail = await getVidDetail({
        vedUrl: `./UploadedFiles/${fileName}`,
      });

      console.log("*********ved detail from probe *************");
      console.log(vidDetail.vedTime); // time in second
      console.log(vidDetail.vedResolution); // Resolution ex: 320x420

      // add data to log file
      DbSyncWrite({
        id: uuidv4(),
        Name: fileName,
        Size: fileSize.toFixed(1),
        time: vidDetail.vedTime,
        resolution: vidDetail.vedResolution,
      });
    } catch (error) {
      console.log("something went wroing ");
      console.log(error);
    }

    res.status(200).send("okay");
  });
  req.on("error", (err) => {
    console.log(err);
    res.status(500).send(err);
  });
}
