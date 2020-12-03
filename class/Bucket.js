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
    getbucketNameAndKey({ objectUrl }){
        var bucket = objectUrl.substring(0, objectUrl.indexOf("/"));
        var key = objectUrl.substring(objectUrl.indexOf("/") + 1, objectUrl.length);
        if(bucket == "")
        {
            bucket = key
            key = ""
        }
        return {bucket,key}
    }
    async objectExists({ objectUrl }) {
        try {
            const {bucket, key} = this.getbucketNameAndKey({ objectUrl });
            await this.s3.getObject({ Bucket: bucket, Key: key }).promise()
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
        const {bucket, key} = this.getbucketNameAndKey({ objectUrl });
        try {
            if (key == "") {
                return await this.checkAndCreateBucket({ bucket: bucket })
            }
            else {
                await this.checkAndCreateBucket({ bucket: bucket })

                var content;
                if (fs.existsSync(filePath)) {
                    content = fs.readFileSync(filePath)
                }
                else {
                    content = await this.getDataFromUrl(filePath)
                }

                return this.s3.putObject({
                    Bucket: bucket,
                    Key: key, //name stored in S3
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

            const {bucket, key} = this.getbucketNameAndKey({ objectUrl });

            if (key != "") {
                return await this.s3.deleteObject({ Bucket: bucket, Key: key }).promise()
            }

            return await this.destroyBucket({ bucket: bucket })
        } catch (e) {
            console.log(e)
            return false
        }
    }

    async downloadObject({ objectUrl, destinationUri }) {
        try {
            const {bucket, key} = this.getbucketNameAndKey({ objectUrl });
            var res = await this.s3.getObject({ Bucket: bucket, Key: key }).promise()
            fs.writeFileSync(destinationUri, res.Body);
            return true;
        } catch (e) {
            console.log(e)
            return false;
        }
    }
}
module.exports = Bucket;