var Bucket = require("./class/Bucket");
var fs = require('fs');
var path = require('path');
var fileContent = fs.readFileSync("README.md");

async function examples(){
    var a = new Bucket()    
    try{
        var bucket = await a.createBucket()
        // var bucket = await a.bucketExists()
        await a.createObject({ objectUrl: "dsfsdf", filePath: " "})
        // var bucket = await a.createObject({ objectUrl: fileContent, filePath: "readme"})
        // var bucket = await a.destroyBucket()

        await a.listObjects();
        // var bucket = await a.exists({objectUrl: "readme"});
        bucket.Contents.forEach(object => {
               console.log(object.Key)
               a.removeObject({objectUrl: object.Key})
        });
        // var bucket = await a.removeObject({objectUrl: 'readme'})

        // var bucket = await a.downloadObject({ objectUrl: "readme", destinationUri: path.join(__dirname, 's3data.md')})
        console.log("SUCCESS: ", bucket)
        
    } catch(e) {
        console.log("ERROR: ",e)
    }
}
examples()