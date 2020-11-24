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
        var res = await this.s3.createBucket({Bucket: this.name});
        return res.data
    }
    upload({filename, content}) {
        this.s3.upload({
            Bucket: this.name,
            Key: filename, //name stored in S3
            Body: content //file content
        });
    }

    destroy(){
        this.s3.deleteBucket({Bucket: this.name});
        delete this;
    }
}