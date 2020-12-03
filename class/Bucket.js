// import entire SDK
const aws = require('aws-sdk')

var fs = require('fs');
var path = require('path')
const fetch = require('node-fetch');

const AbstractBucketManager = require('./AbstractBucketManager');
class Bucket extends AbstractBucketManager {
    constructor() {
        super()
        aws.config.loadFromPath('./config.json');

        this.s3 = new aws.S3({
            accessKeyId: aws.config.accessKeyId,
            secretAccessKey: aws.config.accessKeyId,
            region: aws.config.region,
        });
    }

    async objectExists({ objectUrl }) {
        try {

            var path = objectUrl.substring(0, objectUrl.indexOf("/"));
            var name = objectUrl.substring(objectUrl.indexOf("/") + 1, objectUrl.length);
            await this.s3.getObject({ Bucket: path, Key: name }).promise()
            return true;
        } catch {
            return false;
        }
    }

    async bucketExists({ bucket }) {
        try {
            await this.s3.headBucket({ Bucket: bucket }).promise()
            return true;
        } catch (e) {
            return false;
        }
    }

    async exists({ objectUrl }) {
        try {
            if (objectUrl.indexOf("/") == -1) {
                return await this.bucketExists({ bucket: objectUrl });
            } else {
                return await this.objectExists({ objectUrl })
            }
        } catch {
            return false
        }
    }

    async getDataFromUrl(url) {
        const response = await fetch(url);
        const text = await response.text();
        return text;
    }


    async checkAndCreateBucket({ bucket }) {
        if (!await this.bucketExists({ bucket })) {
            return await this.s3.createBucket({ Bucket: bucket }).promise();
        }
    }

    async createObject({ objectUrl, filePath = "" }) {
        //example : myBucket/coucou
        var path = objectUrl.substring(0, objectUrl.indexOf("/")); //path = myBucket
        var name = objectUrl.substring(objectUrl.indexOf("/") + 1, objectUrl.length);//name = coucou       
        try {
            if (path == "") {
                return await this.checkAndCreateBucket({ bucket: name })
            }
            else {
                await this.checkAndCreateBucket({ bucket: path })

                // var filename = path.basename(filePath)
                // var filename = `${basename}.${ext}`
                var content;
                if (fs.existsSync(filePath)) {
                    content = fs.readFileSync(filePath)
                }
                else {
                    content = this.getDataFromUrl(filePath)
                }

                return this.s3.putObject({
                    Bucket: path,
                    Key: name, //name stored in S3
                    Body: content
                }).promise();
            }
        }
        catch (e) {
            console.log(e)
            return false
        }
    }

    async listObjects({ bucket }) {
        return this.s3.listObjectsV2({ Bucket: bucket }).promise();
    }

    async destroyBucket({ bucket }) {
        try {
            const { Contents } = await this.listObjects({ bucket })
            if (Contents.length > 0) {
                await this.s3
                    .deleteObjects({
                        Bucket: bucket,
                        Delete: {
                            Objects: Contents.map(({ Key }) => ({ Key }))
                        }
                    })
                    .promise();
            }
            return await this.s3.deleteBucket({ Bucket: bucket }).promise();
        } catch (e) {
            console.log(e)
            return false
        }
    }

    async removeObject({ objectUrl }) {
        try {

            var path = objectUrl.substring(0, objectUrl.indexOf("/"));
            var name = objectUrl.substring(objectUrl.indexOf("/") + 1, objectUrl.length);

            if (path != "") {
                return await this.s3.deleteObject({ Bucket: path, Key: name }).promise()
            }

            return await this.destroyBucket({ bucket: name })
        } catch (e) {
            console.log(e)
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
            console.log(e)
            return false;
        }
    }
}
module.exports = Bucket;