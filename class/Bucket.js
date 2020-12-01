// import entire SDK
const aws = require('aws-sdk')

var fs = require('fs');
var path = require('path')
const fetch = require('node-fetch');

const AbstractBucketManager = require('./AbstractBucketManager');
class Bucket extends AbstractBucketManager {
    constructor(name = "awsnode.actualit.info") {
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
            await this.s3.getObject({ Bucket: this.name, Key: objectUrl }).promise()
            return true;
        } catch {
            return false;
        }
    }

    async exists({ objectUrl }) {
        return objectUrl.indexOf("/") != -1 ? this.objectExists({ objectUrl }) : this.bucketExists();
    }

    async getDataFromUrl(url) {
        const response = await fetch(url);
        const text = await response.text();
        return text;
    }

    async createObject({ objectUrl = this.name, filePath = "" }) {
        if (objectUrl.indexOf("/") != -1) {
            return this.s3.createBucket({ Bucket: objectUrl }).promise();
        }
        else {
            var ext = path.extname(filePath)
            var basename = path.basename(filePath)
            var filename = `${basename}.${ext}`
            var content;
            if (fs.existsSync(myfile)) {
                if (File.exists(filePath))
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

    async listObjects() {
        return this.s3.listObjectsV2({ Bucket: this.name }).promise();
    }
    
    async destroyBucket() {
        var objects = await this.listObjects()
        objects.Contents.forEach(object => {
            this.removeObject({ objectUrl: object.Key })
        });
        return this.s3.deleteBucket({ Bucket: this.name }).promise();
    }

    async removeObject({ objectUrl }) {
        if (objectUrl.indexOf("/") != -1) {
            return this.s3.deleteObject({ Bucket: this.name, Key: objectUrl }).promise()
        }
        return this.destroyBucket()
    }

    //TODO refactor
    async downloadObject({ objectUrl, destinationUri }) {
        try {
            var readStream = this.s3.getObject({ Bucket: this.name, Key: objectUrl }).createReadStream();
            let writeStream = fs.createWriteStream(destinationUri);
            readStream.pipe(writeStream);
            return true;
        } catch (e) {
            return false;
        }
    }
}
module.exports = Bucket;