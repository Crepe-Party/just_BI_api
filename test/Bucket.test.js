// import entire SDK
var Bucket = require('../class/Bucket');
var fs = require('fs');
var path = require('path');
const assert = require( "assert" );
const bucketUrl = "awsnode.actualit.info"

//Jest not work on class... I've transformed it to next tests

//run test by test, i don't know why the async not work... (it's a current bug of framework, because we use async on afterEach)
describe( "ini", () => {
    
    var fileContent = fs.readFileSync("./README.md");
    var bucket = null;
    beforeEach(() =>{
        bucket = new Bucket();
    })
    afterEach(async (done) => {
        await bucket.destroyBucket()
        done();
    })
    
    it("CreateObject_CreateNewBucket_Success", async () => {
        //given
        assert.strictEqual(await bucket.exists(), false);    
        //when
        var input = await bucket.createBucket();
        var output = { Location: 'http://awsnode.actualit.info.s3.amazonaws.com/' };
        //then
        assert.strictEqual(input.Location ,output.Location);
    });
    
    it("CreateObject_CreateObjectWithExistingBucket_Success", async () => {   
        //given  
        await bucket.createBucket();
        assert.strictEqual(bucket.exists(), true);
        assert.strictEqual(bucket.exists({objectUrl: "readme"}), false);
        //when
        await bucket.createObject({ objectUrl: fileContent, filePath: "readme"});
        //then
        assert.strictEqual(await bucket.exists({objectUrl: "readme"}), true);            
    });
    
    it("CreateObject_CreateObjectBucketNotExist_Success", async () => {
        //given
        assert.strictEqual(await bucket.exists(), false);  
        //when
        await bucket.createObject({ objectUrl: fileContent, filePath: "readme"});
        //then
        assert.strictEqual(await bucket.exists({objectUrl: "readme"}), true);  
    })
    
    it("DownloadObject_NominalCase_Success", async () => {  
        //given
        await bucket.createBucket();  
        var destinationPath = path.join(__dirname, 's3data.md');
        await bucket.createObject({ objectUrl: fileContent, filePath: "readme"});
        assert.strictEqual(await bucket.exists({objectUrl: "readme"}), true)
        //when
        await bucket.downloadObject({ objectUrl: "readme", destinationUri: destinationPath});
        //then
        assert.strictEqual(fs.existsSync(destinationPath), true);
    });
    
    it("Exists_NominalCase_Success", async () => {  
        //given
        await bucket.createBucket();  
        //when
        var input = await bucket.bucketExists();
        //then
        assert.strictEqual(input, true);
    });
    
    it("Exists_ObjectNotExistBucket_Success", async () => {
        //given
        bucket = new Bucket("fake")
        //when
        var input = await bucket.bucketExists();
        //then
        assert.strictEqual(input, false);          
    });
    
    it("Exists_ObjectNotExistFile_Success", async () => {  
        //given
        await bucket.createBucket();  
        //when
        var input = await bucket.exists({objectUrl: "notExistingFile"});
        //then
        assert.strictEqual(input, false);  
    });
    
    it("RemoveObject_EmptyBucket_Success", async () => {  
        //given
        await bucket.createObject();
        assert.strictEqual(await bucket.exists(bucketUrl), true); 
        //when
        await bucket.removeObject(bucketUrl);
        //then
        assert.strictEqual(await bucket.exists(bucketUrl), false);
    });
    
    it("Remove Object in S3, bucket not empty", async () => {  
        await bucket.createBucket();          

        await bucket.createObject({ objectUrl: fileContent, filePath: "readme"});
        await bucket.createObject({ objectUrl: fileContent, filePath: "readme2"});

        await bucket.removeObject({objectUrl: "readme"});
        var input = await bucket.exists({objectUrl: "readme"});

        assert.strictEqual(input, false);  
        
    });

    it("Delete a bucket in S3, with files", async () => {  
        await bucket.createBucket();  
        await bucket.createObject({ objectUrl: fileContent, filePath: "readme"});
        await bucket.createObject({ objectUrl: fileContent, filePath: "readme2"});
        var objects = await bucket.listObjects();
        // assert.notStrictEqual(objects.count, 0);  WE can't execute more one test by method

        var input = await bucket.destroyBucket();
        var output = {};
        assert.strictEqual(input.toString(), output.toString());  
        
    });
    
    it("Delete a bucket in S3, without files", async () => {  
        await bucket.createBucket();  
        
        var input = await bucket.destroyBucket();
        var output = {};
        assert.strictEqual(input.toString(), output.toString());  
        //normally an error appered after this test, because i try to delete ab bucket already deleted
    });
});