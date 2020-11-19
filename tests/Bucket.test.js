// import entire SDK
import { doesNotMatch } from 'assert';
import { config, S3 } from 'aws-sdk';
import Bucket from "../class/Bucket"
import fs from 'fs';

export default class TestBucket {
    constructor() {
        this.name = "random name";
        config.loadFromPath('../config.json');
        this.s3 = new S3({
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.accessKeyId,
            region: config.region,
        });

        this.fileContent = fs.readFileSync("../README.md");
        this.bucket = new Bucket(this.name);
    };

    Create_CreateBucket_BucketCreated() {
        test("Create a new bucket in S3", () => {
            expect(this.s3.getBucketTagging({ Bucket: name })).not.toBeNull();
        });
    }

    Delete_DeleteBucket_BucketDeleted() {
        test("Create a new bucket in S3", () => {
            expect(this.s3.getBucketTagging({ Bucket: name })).toBeNull();
        });
    }

    Upload_UploadFile_FileUploaded() {
        this.bucket.upload({ filename: "README.md", content: this.fileContent })
        test("Create a new bucket in S3", function (error, data) {
            if (error)
                fail("no file uploaded");

            expect(data.Body.toString('utf-8')).toEqual(fileContent)
        });
    }

    Manage_ManageBucket_AllTestPassed() {
        if (Create_CreateBucket_BucketCreated()
            && Delete_DeleteBucket_BucketDeleted()
            && Upload_UploadFile_FileUploaded()
        ) {
            console.log("Test Upload_UploadFile_FileUploaded : failed")
            return false
        } else {
            console.log("Test Upload_UploadFile_FileUploaded : sucess")
            return true
        }
    }
}