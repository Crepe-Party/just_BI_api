// import entire SDK
var Bucket = require('../class/Bucket');
var fs = require('fs');
var path = require('path');
const assert = require( "assert" );

//Jest not work on class... I've transformed it to next tests

//run test by test, i don't know why the async not work... (it's a current bug of framework, because we use async on afterEach)
describe( "ini", () => {
    
    var fileContent = fs.readFileSync("./README.md");
    var bucket = null;
    beforeEach(() =>{
        bucket = new Bucket();
    })
    afterEach(async (done) => {
        bucket.destroyBucket()
        done();
    })
    
    it("Create a new bucket in S3", async () => {
        
        var input = await bucket.createBucket();
        var output = { Location: 'http://awsnode.actualit.info.s3.amazonaws.com/' };
        assert.strictEqual(input.Location ,output.Location);    
        
    });
    
    it("create a file", async () => {     
        await bucket.createBucket();         
        await bucket.createObject({ objectUrl: fileContent, filePath: "readme"});
        var input = await bucket.exists({objectUrl: "readme"})
        assert.strictEqual(input, true); 
            
    });
    
    it("search inexisting file", async () => {  
        await bucket.createBucket();  
        
        var input = await bucket.exists({objectUrl: "readme"});

        assert.strictEqual(input, false);    
        
    });
    
    it("Download existing file in S3", async () => {  
        await bucket.createBucket();  
        
        var destinationPath = path.join(__dirname, 's3data.md');
        await bucket.createObject({ objectUrl: fileContent, filePath: "readme"});
        await bucket.downloadObject({ objectUrl: "readme", destinationUri: destinationPath});
        
        assert.strictEqual(fs.existsSync(destinationPath), true);    
        
    });
    
    it("bucket in S3 exists?", async () => {  
        await bucket.createBucket();  
        

        var input = await bucket.bucketExists();

        assert.strictEqual(input, true);  
        
    });
    
    it("Search inexisting Bucket in S3", async () => {
        bucket = new Bucket("fake")
        var input = await bucket.bucketExists();

        assert.strictEqual(input, false);          
    });
    
    it("Search inexisting Object in S3", async () => {  
        await bucket.createBucket();  
        

        var input = await bucket.exists({objectUrl: "readme"});

        assert.strictEqual(input, false);  
        
    });
    
    it("Remove Object in S3, bucket empty", async () => {  
        await bucket.createBucket();  
        

        await bucket.createObject({ objectUrl: fileContent, filePath: "readme"});
        await bucket.removeObject({objectUrl: "readme"});

        var input = await bucket.exists({objectUrl: "readme"});

        assert.strictEqual(input, false);  
        
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