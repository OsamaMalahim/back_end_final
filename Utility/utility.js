 import DbSyncRead from "../DBSync/readSync.js";
 import {spawn} from "node:child_process";
 import path from "node:path";


export async function sendVidList(req,res) {
    console.log("reach sendVidList")
    const dataObject = DbSyncRead();     
    console.log("data object is: ");
    res.status(200).send(JSON.stringify(dataObject));
        
}

// Thumb saved in .jpg format same vedio file name
// command :
// ffmpeg -ss 00:00:18 -i s2.mpeg -vframes 1 -q:v 2 ./thumb/s2.jpg
export async function getThumb(vedDetail){
   
    // prepare data
    const file = vedDetail.vedUrl;
    const fileName = path.basename(vedDetail.vedUrl);
    const fileNameWithoutExt = path.parse(fileName).name
    const output = `./thumb/${fileNameWithoutExt}.jpg`;
    const takeAtSecond = '5';
    const numberOfFrames = '1';
    
    return new Promise((resolve, reject)=>{
      // spawn to get thumb
    const ffmpeg = spawn('ffmpeg', [
      '-loglevel',
      'quiet',
      '-ss',      
      takeAtSecond,
      '-i',
      file,
      '-frames',
      numberOfFrames,
      output,
      '-y',
    ]);
    
    ffmpeg.stderr.on('data', (data) => {
      console.log(data.toString());
    });
    
    ffmpeg.on('exit', () => {
      console.log(`thumb generated successfully`);     
      resolve(output);
    });
    })
    
     
}

// vedio details, main concern is resolution
export async function getVidDetail(vedDetail) {

  let vedTime = 0;
  let vedResolution = "";
  // Path to your video file
  const videoPath = vedDetail.vedUrl;

  return new Promise((resolve,reject)=>{
      // Spawn ffprobe process
  const ffprobe =   spawn('ffprobe', [
    '-v', 'quiet', // Suppress unnecessary logs
    '-print_format', 'json', // Output in JSON format
    '-show_format', // Show format information
    '-show_streams', // Show stream information
    videoPath, // Input video file
  ]);

  let stdoutData = '';

  // Collect data from stdout
  ffprobe.stdout.on('data', (data) => {
    stdoutData += data.toString();
  });

  // Handle process completion
  ffprobe.on('close', (code) => {
    if (code !== 0) {
        console.error(`ffprobe process exited with code ${code}`);
        return;
    }

    // Parse the JSON output
    const metadata = JSON.parse(stdoutData);

    // Log video metadata
    vedTime =  parseInt( metadata.format.duration)     
    
    // Resolution
    vedResolution = `${metadata.streams[0].width}x${metadata.streams[0].height}`;

    resolve({ vedTime: vedTime, vedResolution: vedResolution});     
  });

  // Handle errors
  ffprobe.on('error', (err) => {
    console.error('Error spawning ffprobe:', err);
  });   
  console.log("nothing")
    }) // promise end 


}

 