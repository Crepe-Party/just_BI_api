const aws = require('aws-sdk')

var fs = require('fs');
var path = require('path')
const fetch = require('node-fetch');

class DetectingFaces{
    constructor(){
        aws.config.loadFromPath('./config.json');

        this.s3 = new aws.S3({
            accessKeyId: aws.config.accessKeyId,
            secretAccessKey: aws.config.accessKeyId,
            region: aws.config.region,
        });
    }
    /**
     * analyse an image
     * @param {string} imageUri local image path or bucket image path
     * @param {int} maxLabels number of metadata to return
     * @param {int} minConfidence minimum detection rate to be achieved in order to integrate the metadata into the response
     */
    makeAnalysisRequest(imageUri, maxLabels = 10, minConfidence = 80){

    }
}