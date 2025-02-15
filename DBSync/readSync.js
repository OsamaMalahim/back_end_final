import fs from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
    
const __dirname = dirname(fileURLToPath(import.meta.url));  

export default function DbSyncRead(){  
// read file first
var file = {} // empty object
try {
    const fileContent = fs.readFileSync(__dirname+'/DBSync.json')
    file = JSON.parse(fileContent); // return back to object
    // console.log("writing ... first read Okay")
    // console.log(file)
    return file;
} catch (error) {
    console.log(error);
}
}