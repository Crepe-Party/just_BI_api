// import entire SDK
const aws = require('aws-sdk')

var fs = require('fs');
var path = require('path')
const fetch = require('node-fetch');

const AbstractBucketManager = require('./AbstractBucketManager');
class Bucket extends AbstractBucketManager {
    /**
     * @constructor
     * 
     */
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

    /**
     * check the existance of the object / bucket
     * @param {string} objectUrl location on bucket (example awsnode.actualit.info/readme.md)
     * @param {string} objectUrl the bucket (example awsnode.actualit.info)
     * 
     * @retun {bool} does it exist?
     */
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

    /**
     * Create an object on the bucket, create bucket if it not exists
     * @param {string} objectURL location on bucket (example awsnode.actualit.info/readme.md)
     * @param {string} filePath  where is the file local or url? (example with local file: c:\just_BI_api\readme.md, example with url: http://perdu.com/)
     * 
     * @retun {bool} return false when failed
     */
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

    /**
     * remove an object on the bucket
     * @param {string} objectURL location on bucket (example awsnode.actualit.info/readme.md)
     * 
     * @retun {bool} return false when failed
     */
    async removeObject({ objectUrl }) {
        try {
            if(!await this.exists({objectUrl: objectUrl}))
                return false

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

    /**
     * download an object of the bucket on a specific location
     * @param {string} objectUrl location on bucket (example awsnode.actualit.info/readme.md)
     * @param {string} destinationUri  where is the file has to download (example: c:\just_BI_API\downloaded_files\README.md)
     * 
     * @retun {bool} return if it was successful
     */
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