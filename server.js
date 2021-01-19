"use strict"
const fs = require("fs");
const DetectingFaces = require("./class/DetectingFaces");
const Bucket = require("./class/Bucket");
let detectingFaces = new DetectingFaces();
let bucket = new Bucket();

const express = require("express");
var fileupload = require("express-fileupload");

const uuid = require('uuid');
const path = require('path')
const uploadDirLocation = path.join(__dirname, "uploads");

const app = express();
app.use(fileupload());

const port = 3000;

app.get("/", (req, res) => {
    res.send("use /detect-faces");
});

app.post("/detect-faces", async (req, res) => {
    try{
        if(!req.files) {
            res.send({
                status: false,
                message: "form-data 'picture' not found!"
            });
        } else {
            if (!fs.existsSync(uploadDirLocation)) {
                fs.mkdirSync(uploadDirLocation);
            }

            var maxFaces = 1
            var minConfidence = 80
            if(req.body)
            {
                if(req.body.maxFaces && Number(req.body.maxFaces) > 0  )
                    maxFaces = Number(req.body.maxFaces);
                if(req.body.maxFaces && Number(req.body.minConfidence) >= 0 && 100 >= Number(req.body.minConfidence) )
                    minConfidence = Number(req.body.minConfidence);
            }
            let params = {maxFaces, minConfidence};

            let picture = req.files.picture;
            let ext = path.extname(picture.name);
            randomName=`${uuid.v4()}${ext}` // generate unique name to prevent overrides
            let filePath = path.join(uploadDirLocation, randomName);
            //move file on specific dir
            picture.mv(filePath);

            let result = await detectingFaces.makeAnalysisRequest({imageUri: filePath, maxFaces: params.maxFaces, minConfidence: params.minConfidence})
            let date_ob = new Date();
            // date => 2020-JAN-19
            let date = `${date_ob.getFullYear()}-${date.toLocaleString('default', { month: 'short' }).toUpperCase()}-${date.getDate()}`
            let time = `${date_ob.getHours()}:${date_ob.getMinutes}:${date_ob.getSeconds()}`
            //send response
            res.send({
                FileName: picture.name,
                ProcessDate: `${date} ${time}`,
                FaceDetails: result.FaceDetails
            });
        }
    } catch (err) {
        console.log(err)
        res.status(500).send(err);
    }
});

app.listen(port, () => {
    console.log(`WE are LISTENING at http://localhost:${port}`);
})