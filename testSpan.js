import {spawn} from "node:child_process"; 

// Path to your video file
const videoPath = "./UploadedFiles/s2.mpeg";

// Spawn ffprobe process
const ffprobe = spawn('ffprobe', [
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
    console.log(parseInt( metadata.format.duration)); // in second
    // Resolution
    console.log(`${metadata.streams[0].width}x${metadata.streams[0].height}`);            
     
});

// Handle errors
ffprobe.on('error', (err) => {
    console.error('Error spawning ffprobe:', err);
});





















// const file = 'input.mpeg';
// const output = 'output2.png';
// const takeAtSecond = '5';
// const numberOfFrames = '1';

// const ffmpeg = spawn('ffmpeg', [
//   '-ss',
//   takeAtSecond,
//   '-i',
//   file,
//   '-frames',
//   numberOfFrames,
//   output,
//   '-y',
// ]);

// ffmpeg.stderr.on('data', (data) => {
//   console.log(data.toString());
// });

// ffmpeg.on('exit', () => {
//   console.log(`Image generated successfully`);
// });

// const dir = spawn('dir3');

// dir.stdout.on("data", (chunck)=>{
//     console.log(chunck.toString("utf-8"));
// })
// dir.on("close",(code)=>{
//     console.log(`child process close all stdio with code ${code}`);
// })

// dir.on("exit",(code)=>{
//     console.log(`child process exited with error code ${code}`);
// })
