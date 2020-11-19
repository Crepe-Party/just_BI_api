// @Brief : Test aws bucket
// @Author : Florian Bergmann
// @Remarks : 

class TestBucket{
    constructor(){};

    Create_CreateBucket_BucketCreated(){
        try {
            if(Bucket.get('name') == null) Bucket.new("name")
            console.log("Test Create_CreateBucket_BucketCreated : sucess")
            return true
        } catch (error) {
            console.log("Test Create_CreateBucket_BucketCreated : failed")
            return false
        }
    }
    Delete_DeleteBucket_BucketDeleted(){
        try {
            if(Bucket.get('name') != null) Bucket.delete("name")
            console.log("Test Delete_DeleteBucket_BucketDeleted : sucess")
            return true
        } catch (error) {
            console.log("Test Delete_DeleteBucket_BucketDeleted : failed")
            return false
        }
    }
    Upload_UploadFile_FileUploaded(){
        try {
            bucket = Bucket.get('name')
            if(bucket.get('image name') == null) bucket.upload(image, "name")
            console.log("Test Upload_UploadFile_FileUploaded : sucess")
            return true
        } catch (error) {
            console.log("Test Upload_UploadFile_FileUploaded : failed")
            return false
        }
    }
    Manage_ManageBucket_AllTestPassed(){
        if( Create_CreateBucket_BucketCreated() 
            && Delete_DeleteBucket_BucketDeleted() 
            && Upload_UploadFile_FileUploaded()
        ){
            console.log("Test Upload_UploadFile_FileUploaded : failed")
            return false
        }else{
            console.log("Test Upload_UploadFile_FileUploaded : sucess")
            return true
        }

    }
}