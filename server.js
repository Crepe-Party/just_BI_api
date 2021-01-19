"use strict"
const fs = require("fs");
const DetectingFaces = require("./class/DetectingFaces");
const Bucket = require("./class/Bucket");
let detectingFaces = new DetectingFaces();
let bucket = new Bucket();

const express = require("express");
var fileupload = require("express-fileupload");

const uuid = require('uuid');
const path = require('path');
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
            let randomName=`${uuid.v4()}${ext}` // generate unique name to prevent overrides
            let filePath = path.join(uploadDirLocation, randomName);
            //move file on specific dir
            picture.mv(filePath);

            let date_ob = new Date();

            let result = await detectingFaces.makeAnalysisRequest({imageUri: filePath, maxFaces: params.maxFaces, minConfidence: params.minConfidence})
            GeneratSQLAnswer(result, path.parse(picture.name).name, date_ob.toISOString().slice(0, 19).replace('T', ' '))
            
            fs.unlink(filePath, function (err){
                if(err) console.error(err)
            })
            
            // date => 2020-JAN-19
            let date = `${date_ob.getFullYear()}-${date_ob.toLocaleString('en', { month: 'short' }).toUpperCase()}-${date_ob.getDate()}`
            let time = `${date_ob.getHours()}:${date_ob.getMinutes()}:${date_ob.getSeconds()}`
            
            //send response
            res.send({
                FileName: picture.name,
                ProcessDate: `${date} ${time}`,
                FaceDetails: result.FaceDetails
            });
        }
    } catch (err) {
        console.error(err)
        res.status(500).send(err);
    }
});

app.listen(port, () => {
    console.log(`WE are LISTENING at http://localhost:${port}`);
})

async function GeneratSQLAnswer(result, pictureName, datetime){
    fs.readFile("./databaseModelRIA2.sql", 'utf8', function (err,data) {
        if (err) {
          return console.error(err);
        }
        let sqlfile = data.replace("???", `("${pictureName}", "${datetime}")`)
        let sqlInsert = []
        for (let attribute in result.FaceDetails[0]) {
            sqlInsert.push(`("${attribute}", "${result.FaceDetails[0][attribute].Value}", ${result.FaceDetails[0][attribute].Confidence}, @fileID)`)
        }
        sqlfile = sqlfile.replace("????", sqlInsert.join(","))
        let filePath = path.join(uploadDirLocation, pictureName+".sql");
        fs.writeFile(filePath, sqlfile, async function (err) {
            if(err){
                console.error(err)
            }else{
                await bucket.createObject({ objectUrl: `awsnode1.actualit.info/${pictureName}.sql`, filePath: filePath });
                fs.unlink(filePath, function (err){
                    if(err) console.error(err)
                })
            }
        })

    })
}