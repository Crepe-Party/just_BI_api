// import entire SDK
const aws = require('aws-sdk')
var fs = require('fs');
const AbstractBucketManager = require('./AbstractBucketManager');
class Bucket extends AbstractBucketManager {
    constructor(name = "awsnode.actualit.info"){   
        super()        
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
        return this.s3.createBucket({Bucket: this.name}).promise();
    }
    async destroyBucket(){
        var objects = await this.listObjects()
        objects.Contents.forEach( object => {
            this.removeObject({objectUrl: object.Key})
        });
        return this.s3.deleteBucket({Bucket: this.name}).promise();
    }
    // object
    async createObject({objectUrl, filePath = ""}) {
        return this.s3.putObject({
            Bucket: this.name,
            Key: filePath, //name stored in S3
            Body: objectUrl //file content
        }).promise();
    }
    
    async bucketExists(){   
        try{
            await this.s3.headBucket({ Bucket: this.name }).promise()
            return true;
        } catch{
            return false;
        }
    }
    async exists({objectUrl}){
        try{
            await this.s3.getObject({Bucket: this.name, Key: objectUrl}).promise()
            return true;
        } catch (e){
            return false;
        }
    }
    async removeObject({objectUrl}){
        return this.s3.deleteObject({Bucket: this.name, Key: objectUrl}).promise()
    }
    async downloadObject({objectUrl, destinationUri}){
        try{            
            var readStream = this.s3.getObject({Bucket: this.name, Key: objectUrl}).createReadStream();
            let writeStream = fs.createWriteStream(destinationUri);
            readStream.pipe(writeStream);
            return true;
        } catch (e){
            return false;
        }
    }
    async listObjects(){
        return this.s3.listObjectsV2({ Bucket: this.name }).promise();
    }
}
module.exports = Bucket;