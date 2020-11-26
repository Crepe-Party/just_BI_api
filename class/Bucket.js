// import entire SDK
var aws = require('aws-sdk')

module.exports = class Bucket {
    constructor(){           
        aws.config.loadFromPath('./config.json');
        this.name = "awsnode.actualit.info";

        this.s3 = new aws.S3({             
            accessKeyId: aws.config.accessKeyId,
            secretAccessKey: aws.config.accessKeyId,
            region: aws.config.region,
        });
    }
    async createBucket(){
        return this.s3.createBucket({Bucket: this.name}).promise()
    }
    async upload({filename, content}) {
        return this.s3.upload({
            Bucket: this.name,
            Key: filename, //name stored in S3
            Body: content //file content
        }).promise();
    }

    async destroy(){
       return this.s3.deleteBucket({Bucket: this.name}).promise();
    }
}