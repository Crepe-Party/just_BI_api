const aws = require('aws-sdk')

var fs = require('fs');
var path = require('path')
const fetch = require('node-fetch');
const client = new AWS.Rekognition();

const AbstractDetectingFacesManage = require('./AbstractDetectingFacesManage');
class DetectingFaces extends AbstractDetectingFacesManage{
    constructor(){
        super()
        aws.config.loadFromPath('./config.json');
        this.s3 = new aws.S3({
            accessKeyId: aws.config.accessKeyId,
            secretAccessKey: aws.config.accessKeyId,
            region: aws.config.region,
        });
    }
    makeAnalysisRequest({imageUri, maxFaces = 10, minConfidence = 80}){
        var bucketname = imageUri.substring(0, imageUri.indexOf("/"));
        var filename = imageUri.substring(imageUri.indexOf("/") + 1, imageUri.length);
        client.detectFaces({
            Image: {
                S3Object: {
                    Bucket: bucketname,
                    Name: filename
                },
            },
            Attributes: ['ALL']
        }, function(err, response){
            if (err) {
                console.log(err, err.stack);
                return {};
            } else {
                return response;
            }
        })
    }
}
module.exports = DetectingFaces;