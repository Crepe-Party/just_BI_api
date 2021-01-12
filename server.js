"use strict"
const fs = require("fs").promises;

const express = require("express");
var fileupload = require("express-fileupload");

const uuid = require('uuid');
const path = require('path')
const uploadDirLocation = path.join(__dirname, "uploads");

// import DetectingFaces
// makeAnalysisRequest({})
// makeAnalysisRequest({imageUri, maxFaces = 10, minConfidence = 80})
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
            console.log(uploadDirLocation);
            let params = null;
            if(req.body)
            {
                let params = req.body;
            }
            console.log("params: ", params);

            let picture = req.files.picture;
            let ext = path.extname(picture.name);
            picture.name=`${uuid.v4()}${ext}` // generate unique name to prevent overrides

            //move file on specific dir
            picture.mv(path.join(uploadDirLocation, picture.name));

            //send response
            res.send({
                status: true,
                message: 'Success',
                data: {
                    name: picture.name,
                    mimetype: picture.mimetype,
                    size: picture.size
                }
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