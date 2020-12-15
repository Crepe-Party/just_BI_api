const aws = require('aws-sdk')

var fs = require('fs');
var path = require('path')
const fetch = require('node-fetch');

const AbstractDetectingLabelsManage = require('./AbstractDetectingLabelsManage');
class DetectingLabels extends AbstractDetectingLabelsManage{
    constructor(){
        super()
        aws.config.loadFromPath('./config.json');

        this.s3 = new aws.S3({
            accessKeyId: aws.config.accessKeyId,
            secretAccessKey: aws.config.accessKeyId,
            region: aws.config.region,
        });
    }
    makeAnalysisRequest({imageUri, maxLabels = 10, minConfidence = 80}){
        return {};
    }
}
module.exports = DetectingLabels;