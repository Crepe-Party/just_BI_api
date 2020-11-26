// import entire SDK
const aws = require('aws-sdk')
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
    destroyBucket(){
        this.s3.deleteBucket({Bucket: this.name});
        delete this;
    }
    // object
    createObject({objectUrl, filePath = ""}) {
        this.s3.upload({
            Bucket: this.name,
            Key: filePath, //name stored in S3
            Body: objectUrl //file content
        });
    }
    exists({objectUrl}){

    }
    removeObject({objectUrl}){

    }
    async downloadObject({objectUrl, destinationUri}){

    }
}