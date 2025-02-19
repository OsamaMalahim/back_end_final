import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url); // Convert URL to file path
const __dirname = dirname(__filename); // Get directory name

// Path to your JSON file
const filePath = path.join(__dirname, "..", "DBSync", "DBSync.json");
// const filePath =  "../DBSync/DBSync.json";

// Function to update the year of a specific car
export function updateAudioStatus(vedId) {
  // Step 1: Read the JSON file
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }

    // Parse the JSON data into a JavaScript object
    let vedios = JSON.parse(data);

    // Step 2: Find the specific car by its ID
    const vedioToUpdate = vedios.data.find((ved) => ved.id === vedId);
    console.log("printing the vedio to update", vedioToUpdate);
    if (vedioToUpdate) {
      // Step 3: Update the year of the car
      vedioToUpdate.audio = true;
      console.log("true insdie...........");
      console.log(vedioToUpdate);
      // Step 4: Write the updated data back to the JSON file
      fs.writeFile(filePath, JSON.stringify(vedios, null, 2), "utf8", (err) => {
        if (err) {
          console.error("Error writing file:", err);
        } else {
          console.log(
            `Successfully updated the audio status of ved with ID ${vedId} to true`
          );
        }
      });
    } else {
      console.error(`ved with id ${vedId} not found.`);
    }
  });
}
