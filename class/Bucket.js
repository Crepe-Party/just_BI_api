// import entire SDK
const aws = require('aws-sdk')

var fs = require('fs');
var path = require('path')
const fetch = require('node-fetch');

const AbstractBucketManager = require('./AbstractBucketManager');
class Bucket extends AbstractBucketManager {
    constructor(name = "awsnodecrash.actualit.info") {
        super()
        aws.config.loadFromPath('./config.json');
        this.name = name;

        this.s3 = new aws.S3({
            accessKeyId: aws.config.accessKeyId,
            secretAccessKey: aws.config.accessKeyId,
            region: aws.config.region,
        });
    }

    async bucketExists() {
        try {
            await this.s3.headBucket({ Bucket: this.name }).promise()
            return true;
        } catch {
            return false;
        }
    }
    async objectExists({ objectUrl }) {
        try {
            
            var path = objectUrl.substring(0, objectUrl.lastIndexOf("/"));
            var name = objectUrl.substring(objectUrl.lastIndexOf("/") + 1, objectUrl.length);
            await this.s3.getObject({ Bucket: path, Key: name }).promise()
            return true;
        } catch {
            return false;
        }
    }

    async exists({ objectUrl }) {         
        try{
            if (objectUrl.indexOf("/") == -1 ){
                return await this.bucketExists();
            }else{       
                return await this.objectExists({ objectUrl })
            }
        }catch{
            return false
        }
    }

    async getDataFromUrl(url) {
        const response = await fetch(url);
        const text = await response.text();
        return text;
    }

    async checkBucket({ objectUrl }){
        if(! await this.bucketExists()) 
            this.s3.createBucket({ Bucket: objectUrl }).promise();
    }

    async createObject({ objectUrl = this.name, filePath = "" }) {   
        try{
            if (objectUrl.indexOf("/") == -1) {
                await this.checkBucket({objectUrl})
                return this.s3.createBucket({ Bucket: objectUrl }).promise();
            }
            else {
                //erreur dans ce block
                await this.checkBucket({objectUrl})
                var filename = path.basename(filePath)
                // var filename = `${basename}.${ext}`
                var content;
                if (fs.existsSync(filePath)) {
                    content = fs.readFileSync(filePath)
                }
                else {
                    content = this.getDataFromUrl(filePath)
                }
                
                return this.s3.putObject({
                    Bucket: this.name,
                    Key: filename, //name stored in S3
                    Body: content
                }).promise();
            }
        }            
        catch{
            return false
        }
    }

    async listObjects({bucket}) {
        return this.s3.listObjectsV2({ Bucket: bucket }).promise();
    }

    async destroyBucket({ bucket }) {
        try{
            var objects = await this.listObjects({bucket})
            objects.Contents.forEach(object => {
                this.removeObject({ objectUrl: `${bucket}/${object.Key}` })
            });
            return this.s3.deleteBucket({ Bucket: bucket }).promise();    
        } catch{
            return false
        }
    }

    async removeObject({ objectUrl }) {
        try{
            
            var path = objectUrl.substring(0, objectUrl.lastIndexOf("/"));
            var name = objectUrl.substring(objectUrl.lastIndexOf("/") + 1, objectUrl.length);
            if (path != "") {
                return this.s3.deleteObject({ Bucket: path, Key: name }).promise()
            }

            return this.destroyBucket({bucket: name})
        }catch{
            return false
        }
    }

    //TODO refactor
    async downloadObject({ objectUrl, destinationUri }) {
        try {
            var readStream = this.s3.getObject({ Bucket: objectUrl, Key: path.basename(objectUrl) }).createReadStream();
            let writeStream = fs.createWriteStream(destinationUri);
            readStream.pipe(writeStream);
            return true;
        } catch (e) {
            return false;
        }
    }
}
module.exports = Bucket;