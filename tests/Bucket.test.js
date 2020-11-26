// import entire SDK
const Bucket = require('../class/Bucket');
const aws = require('aws-sdk');
const fs = require('fs');

module.exports = class TestBucket {
    constructor() {
        this.name = "random name";
        aws.config.loadFromPath('../config.json');
        this.s3 = new aws.S3({
            accessKeyId: aws.config.accessKeyId,
            secretAccessKey: aws.config.accessKeyId,
            region: aws.config.region,
        });

        this.fileContent = fs.readFileSync("../README.md");
        this.bucket = new Bucket(this.name);
    };
    CreateObject_CreateNewBucket_Success() {
        test("Create a new bucket in S3", () => {
            expect(this.s3.getBucketTagging({ Bucket: name })).not.toBeNull();
        });
    }
    CreateObject_CreateObjectWithExistingBucket_Success(){
        this.bucket.upload({ filename: "README.md", content: this.fileContent })
        test("Create a new bucket in S3", function (error, data) {
            if (error)
                fail("no file uploaded");
    
            expect(data.Body.toString('utf-8')).toEqual(fileContent)
        });
    }
    CreateObject_CreateObjectBucketNotExist_Success(){

    }
    DownloadObject_NominalCase_Success(){

    }
    Exists_NominalCase_Success(){

    }
    Exists_ObjectNotExistBucket_Success(){

    }
    Exists_ObjectNotExistFile_Success(){

    }
    RemoveObject_EmptyBucket_Success(){

    }
    RemoveObject_NotEmptyBucket_Success(){

    }
    Delete_DeleteBucket_BucketDeleted() {
        
    }

    Manage_ManageBucket_AllTest(){
        CreateObject_CreateNewBucket_Success()
        CreateObject_CreateObjectWithExistingBucket_Success()
        CreateObject_CreateObjectBucketNotExist_Success()
        DownloadObject_NominalCase_Success()
        Exists_NominalCase_Success()
        Exists_ObjectNotExistBucket_Success()
        Exists_ObjectNotExistFile_Success()
        RemoveObject_EmptyBucket_Success()
        RemoveObject_NotEmptyBucket_Success()
        Delete_DeleteBucket_BucketDeleted()    
    }
}