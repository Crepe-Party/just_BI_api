// import entire SDK
var Bucket = require('../class/Bucket');
var fs = require('fs');
var path = require('path');
const assert = require( "assert" );
const bucketUrl = "awsnode.actualit.info"
const filePath = "README.md"
const fileUrl = bucketUrl+"/"+filePath

//Jest not work on class... I've transformed it to next tests

//run test by test, i don't know why the async not work... (it's a current bug of framework, because we use async on afterEach)
describe( "ini", () => {
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
        assert.strictEqual(await bucket.exists({objectUrl: bucketUrl}), false);    
        //when
        await bucket.createObject({objectUrl: bucketUrl});
        //then
        assert.strictEqual(await bucket.exists({objectUrl: bucketUrl}), true);
    });
    
    it("CreateObject_CreateObjectWithExistingBucket_Success", async () => {   
        //given  
        await bucket.createObject({objectUrl: bucketUrl});
        assert.strictEqual(await bucket.exists({objectUrl: bucketUrl}), true);
        assert.strictEqual(await bucket.exists({objectUrl: fileUrl}), false);
        //when
        await bucket.createObject({ objectUrl: fileUrl, filePath: filePath});
        //then
        assert.strictEqual(await bucket.exists({objectUrl: fileUrl}), true);            
    });
    
    it("CreateObject_CreateObjectBucketNotExist_Success", async () => {
        //given
        assert.strictEqual(await bucket.exists({objectUrl: bucketUrl}), false);  
        assert.strictEqual(await bucket.exists({objectUrl: fileUrl}), false);  
        //when
        await bucket.createObject({ objectUrl: fileUrl, filePath: filePath});
        //then
        assert.strictEqual(await bucket.exists({objectUrl: filePath}), true);  
    })
    
    it("DownloadObject_NominalCase_Success", async () => {  
        //given 
        await bucket.createObject({ objectUrl: fileUrl, filePath: filePath});
        assert.strictEqual(await bucket.exists({objectUrl: bucketUrl}), true)
        //when
        await bucket.downloadObject({ objectUrl: fileUrl, destinationUri: filePath});
        //then
        assert.strictEqual(fs.existsSync(filePath), true);
    });
    
    it("Exists_NominalCase_Success", async () => {  
        //given
        await bucket.createObject({objectUrl: bucketUrl});  
        //when
        var input = await bucket.exists({objectUrl: bucketUrl});
        //then
        assert.strictEqual(input, true);
    });
    
    it("Exists_ObjectNotExistBucket_Success", async () => {
        //given
        var notExistingBucket = "notExistingBucket"
        //when
        var input = await bucket.exists({objectUrl: notExistingBucket});
        //then
        assert.strictEqual(input, false);          
    });
    
    it("Exists_ObjectNotExistFile_Success", async () => {
        //given
        await bucket.createObject({ objectUrl: bucketUrl});
        assert.strictEqual(await bucket.exists({ objectUrl: bucketUrl}), false);
        //when
        var input = await bucket.exists({objectUrl: "notExistingFile.jpg"});
        //then
        assert.strictEqual(input, false);
    });
    
    it("RemoveObject_EmptyBucket_Success", async () => {  
        //given
        await bucket.createObject({objectUrl: bucketUrl});
        assert.strictEqual(await bucket.exists({objectUrl: bucketUrl}), true); 
        //when
        await bucket.removeObject({objectUrl: bucketUrl});
        //then
        assert.strictEqual(await bucket.exists({objectUrl: bucketUrl}), false);
    });
    
    it("RemoveObject_NotEmptyBucket_Success", async () => {  
        //given          
        await bucket.createObject({objectUrl: fileUrl, filePath: filePath});
        assert.strictEqual(await bucket.exists({objectUrl: bucketUrl}), true);
        assert.strictEqual(await bucket.exists({objectUrl: fileUrl, filePath: filePath}), true);
        //when
        await bucket.removeObject({objectUrl: bucketUrl});
        //then
        assert.strictEqual(await bucket.exists({objectUrl: bucketUrl}), false);  
    });
});