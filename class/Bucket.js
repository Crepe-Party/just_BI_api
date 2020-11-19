// import entire SDK
import { config, S3 } from 'aws-sdk';

export default class Bucket {
    constructor(name){           
        this.name = name;

        config.loadFromPath('./config.json');
        this.s3 = new S3({             
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.accessKeyId,
            region: config.region,
        });
        
        this.s3.createBucket({Bucket: name});
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

    get name(){
        return this.name;
    }

    get listObjects(){
        return this.s3.listObjects({Bucket: this.name})
    }
}