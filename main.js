var Bucket = require("./class/Bucket");
var DetectingFaces = require("./class/DetectingFaces");
var fs = require('fs');
var path = require('path');
var fileContent = fs.readFileSync("README.md");

async function examples(){
    var bucket = new Bucket()
    var detectingFaces = new DetectingFaces()
    try{
        await bucket.createObject({ objectUrl: "awsnode.actualit.info/gandhi.png", filePath: __dirname+"/test/gandhi.png" });

    } catch(e) {
        console.log("ERROR: ",e)
    }
}
examples()