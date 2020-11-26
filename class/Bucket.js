// import entire SDK
var aws = require('aws-sdk')
const AbstractBucketManager = require('./AbstractBucketManager');
module.exports = class Bucket extends AbstractBucketManager {
    constructor(name = "awsnode.actualit.info"){           
        aws.config.loadFromPath('./config.json');
        this.name = name;

        this.s3 = new aws.S3({             
            accessKeyId: aws.config.accessKeyId,
            secretAccessKey: aws.config.accessKeyId,
            region: aws.config.region,
        });
    }
    // bucket method
    async createBucket(){
        return await this.s3.createBucket({Bucket: this.name});
    }
    async destroyBucket(){
        return this.s3.deleteBucket({Bucket: this.name}).promise();
    }
    // object
    async createObject({objectUrl, filePath = ""}) {
        return this.s3.upload({
            Bucket: this.name,
            Key: filePath, //name stored in S3
            Body: objectUrl //file content
        }).promise();
    }
    async exists({objectUrl}){

    }
    async removeObject({objectUrl}){

    }
    async downloadObject({objectUrl, destinationUri}){
    }
}