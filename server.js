import express from "express";
import { UploadFile } from "./Routes/Routes.js";
import cors from "cors";
import  {sendVidList} from "./Utility/utility.js";
 

const app = express();
app.use(cors());

const PORT = 3001;

// send all vid list
app.get("/", async(req,res)=>{
    console.log("route / targeted !");
	await sendVidList(req,res);
    
})


app.post("/uploadFile", async (req, res) => {
	console.log("route /uploadFile targeted !")
	await UploadFile(req, res);
});

app.listen(PORT, () => {
	console.log(`running on PORT ${PORT}`);
});
