import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url); // Convert URL to file path
const __dirname = dirname(__filename); // Get directory name

// Path to your JSON file
const filePath = path.join(__dirname, "cars.json");

// Function to update the year of a specific car
function updateCarYear(carId, newYear) {
  // Step 1: Read the JSON file
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }

    // Parse the JSON data into a JavaScript object
    let cars = JSON.parse(data);

    // Step 2: Find the specific car by its ID
    const carToUpdate = cars.find((car) => car.id === carId);

    if (carToUpdate) {
      // Step 3: Update the year of the car
      carToUpdate.year = newYear;

      // Step 4: Write the updated data back to the JSON file
      fs.writeFile(filePath, JSON.stringify(cars, null, 2), "utf8", (err) => {
        if (err) {
          console.error("Error writing file:", err);
        } else {
          console.log(
            `Successfully updated the year of car with ID ${carId} to ${newYear}`
          );
        }
      });
    } else {
      console.error(`Car with ID ${carId} not found.`);
    }
  });
}

// Example usage: Update the year of the car with ID 123 to 2023
updateCarYear(1234, 3000);

// import React, { useState } from "react";

// const App = () => {
//   // Sample data for buttons
//   const buttonsData = [
//     { id: 1, name: "Button 1" },
//     { id: 2, name: "Button 2" },
//     { id: 3, name: "Button 3" },
//   ];

//   // State to manage the text for each button
//   const [buttonStates, setButtonStates] = useState({});

//   // Function to handle button click and update state
//   const handleButtonClick = (id) => {
//     setButtonStates((prevStates) => {
//       const currentState = prevStates[id] || "Download"; // Default to 'Download' if no state exists
//       let nextState;

//       if (currentState === "Download") {
//         nextState = "Processing";
//         // Simulate processing (e.g., API call or async operation)
//         setTimeout(() => {
//           setButtonStates((prev) => ({ ...prev, [id]: "Extract Audio" }));
//         }, 2000); // Change to 'Extract Audio' after 2 seconds
//       } else if (currentState === "Extract Audio") {
//         nextState = "Download"; // Reset to 'Download' after extraction
//       } else {
//         nextState = currentState; // Keep the current state if it's 'Processing'
//       }

//       return {
//         ...prevStates,
//         [id]: nextState,
//       };
//     });
//   };

//   return (
//     <div>
//       {buttonsData.map((button) => (
//         <div key={button.id}>
//           <button onClick={() => handleButtonClick(button.id)}>
//             {buttonStates[button.id] || "Download"}
//           </button>
//           <span> - {button.name}</span>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default App;

// // let base64Image = "";
// //     try {
// //       // read thumb image file
//       const dataImage = await fs.readFile(fileName);
//       // Convert the thumb to a Base64 string to send to frontEnd
//       base64Image = Buffer.from(dataImage).toString("base64");
//     } catch (error) {
//       console.log("error during reading thumb file and decode it", error);
//     }

// import { spawn } from "node:child_process";
// // import DbSyncRead from "../DBSync/readSync.js";

// import path from "node:path";

// import { fileURLToPath } from "url";
// import { dirname } from "path";

// const __filename = fileURLToPath(import.meta.url); // Convert URL to file path
// const __dirname = dirname(__filename); // Get directory name

// const file = "./UploadedFiles/River.mp4";
// const thumbnailTime = "00:00:08";
// const output = "example.jpg";
// console.log(output)
// console.log(file)
// const ffmpegArgs = [
//   "-i",
//   file,
//   "-ss",
//   thumbnailTime,
//   "-vframes",
//   "1",
//   "-q:v",
//   "2",
//   output,
//   "-y",
// ];

// const ffmpeg = spawn("ffmpeg", ffmpegArgs);

// ffmpeg.stderr.on("data", (data) => {
//   console.log(data.toString());
// });

// // Path to your video file
// const videoPath = "./UploadedFiles/s2.mpeg";

// // Spawn ffprobe process
// const ffprobe = spawn('ffprobe', [
//     '-v', 'quiet', // Suppress unnecessary logs
//     '-print_format', 'json', // Output in JSON format
//     '-show_format', // Show format information
//     '-show_streams', // Show stream information
//     videoPath, // Input video file
// ]);

// let stdoutData = '';

// // Collect data from stdout
// ffprobe.stdout.on('data', (data) => {
//     stdoutData += data.toString();
// });

// // Handle process completion
// ffprobe.on('close', (code) => {
//     if (code !== 0) {
//         console.error(`ffprobe process exited with code ${code}`);
//         return;
//     }

//     // Parse the JSON output
//     const metadata = JSON.parse(stdoutData);

//     // Log video metadata
//     console.log(parseInt( metadata.format.duration)); // in second
//     // Resolution
//     console.log(`${metadata.streams[0].width}x${metadata.streams[0].height}`);

// });

// // Handle errors
// ffprobe.on('error', (err) => {
//     console.error('Error spawning ffprobe:', err);
// });

// // const file = 'input.mpeg';
// // const output = 'output2.png';
// // const takeAtSecond = '5';
// // const numberOfFrames = '1';

// // const ffmpeg = spawn('ffmpeg', [
// //   '-ss',
// //   takeAtSecond,
// //   '-i',
// //   file,
// //   '-frames',
// //   numberOfFrames,
// //   output,
// //   '-y',
// // ]);

// // ffmpeg.stderr.on('data', (data) => {
// //   console.log(data.toString());
// // });

// // ffmpeg.on('exit', () => {
// //   console.log(`Image generated successfully`);
// // });

// // const dir = spawn('dir3');

// // dir.stdout.on("data", (chunck)=>{
// //     console.log(chunck.toString("utf-8"));
// // })
// // dir.on("close",(code)=>{
// //     console.log(`child process close all stdio with code ${code}`);
// // })

// // dir.on("exit",(code)=>{
// //     console.log(`child process exited with error code ${code}`);
// // })
