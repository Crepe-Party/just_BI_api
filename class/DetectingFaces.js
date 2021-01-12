const aws = require('aws-sdk')

var fs = require('fs');
var path = require('path')
const fetch = require('node-fetch');
const client = new aws.Rekognition();

const AbstractDetectingFacesManager = require('./AbstractDetectingFacesManager');
const Bucket = require('./Bucket');
class DetectingFaces extends AbstractDetectingFacesManager{
    constructor(){
        super()
        aws.config.loadFromPath('./config.json');
        this.s3 = new aws.S3({
            accessKeyId: aws.config.accessKeyId,
            secretAccessKey: aws.config.accessKeyId,
            region: aws.config.region,
        });
        this.bucket = new Bucket();

    }
    async makeAnalysisRequest({imageUri, maxFaces = 10, minConfidence = 80}){
        if(/^[A-z]:/.test(imageUri) || imageUri.startsWith("/")){
            var bucketname = "awsnode1.actualit.info"
            var filename = imageUri.split("/").pop()
            if(await this.bucket.createObject({ objectUrl: bucketname+"/"+filename, filePath: imageUri }) == false){
                console.log(28, `Image ${filename} can't be created on bucket ${bucketname}`)
                return {"FaceDetails": []}
            }
        }else{
            var bucketname = imageUri.substring(0, imageUri.indexOf("/"))
            var filename = imageUri.substring(imageUri.indexOf("/") + 1, imageUri.length)
            if(await this.bucket.exists({objectUrl: imageUri}) == false){
                console.log(34, `Image ${filename} not exist on bucket ${bucketname}`)
                return {"FaceDetails": []}
            }
        }

        var res = await client.detectFaces({
            Image: {
                S3Object: {
                    Bucket: bucketname,
                    Name: filename
                },
            },
            Attributes: ['ALL']
        }, function(err, response){
            if (err) {
                console.log(49, err, err.stack)
                return {"FaceDetails": []}
            } else {
                var result = response.FaceDetails[0]
                //Exclude attribute with confidence less than minConfidence parameter or no confidence
                for (var attribute in result) {
                    if(!result[attribute].hasOwnProperty('Confidence') || result[attribute].Confidence < minConfidence){
                        delete result[attribute]
                    }
                }
                //Sort results DESC and limit to maxFaces parameter
                var sorted = {};
                var nbrFaces = 1;
                Object.keys(result).sort(function(a, b){
                    return result[b].Confidence - result[a].Confidence;
                }).forEach(function(key) {
                    if(nbrFaces <= maxFaces){
                        sorted[key] = result[key]
                        nbrFaces++
                    }
                });
                return {"FaceDetails": [sorted]}
            }
        }).promise()
        return res
    }
}
module.exports = DetectingFaces;