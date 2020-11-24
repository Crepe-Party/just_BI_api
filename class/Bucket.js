// import entire SDK
import { config, S3 } from 'aws-sdk';
import AbstractBucketManager from AbstractBucketManager

export default class Bucket extends AbstractBucketManager {
    constructor(name){           
        this.name = name;

        config.loadFromPath('./config.json');
        this.s3 = new S3({             
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.accessKeyId,
            region: config.region,
        });
        
        this.createBucket();
    }
    // bucket method
    createBucket(){
        this.s3.createBucket({Bucket: this.name});
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
    downloadObject({objectUrl, destinationUri}){

    }
}