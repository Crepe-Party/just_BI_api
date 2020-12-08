// import entire SDK
var Bucket = require('../class/Bucket');
var fs = require('fs');
const assert = require("assert");
var bucketNumber = 1;
const filename = "README.md"
const fullPathToFile = __dirname + "/../" + filename
const fullPathToDestination = __dirname + "/../"
const myURL = "http://www.perdu.com/"

function bucketUrl(){
    return "awsnode"+bucketNumber+".actualit.info"
}

var bucket = new Bucket();
// when you execute all test winth "npm test", random tests fail...
// but if you use "mocha -g name_of_test" each test pass
describe("init", () => {
    before(function (done) {
        this.timeout(15000)
        setTimeout(function () {
            done() //we wait 5sec, beacause aws require a few times after each bucket delete
        }, 5000)
    })
    afterEach(async () => {
        await bucket.removeObject({ objectUrl: bucketUrl() })
        bucketNumber++
    })
    
    it("CreateObject_CreateNewBucket_Success", async () => {
        //given
        assert.strictEqual(await bucket.exists({ objectUrl: bucketUrl() }), false);
        //when
        await bucket.createObject({ objectUrl: bucketUrl() });
        //then
        assert.strictEqual(await bucket.exists({ objectUrl: bucketUrl() }), true);
    }).timeout(15000);

    it("CreateObject_CreateObjectWithExistingBucket_Success", async () => {
        //given  
        await bucket.createObject({ objectUrl: bucketUrl() });
        assert.strictEqual(await bucket.exists({ objectUrl: bucketUrl() }), true);
        assert.strictEqual(await bucket.exists({ objectUrl: bucketUrl()+"/"+filename }), false);
        //when
        await bucket.createObject({ objectUrl: bucketUrl()+"/"+filename, filePath: fullPathToFile });
        //then
        assert.strictEqual(await bucket.exists({ objectUrl: bucketUrl()+"/"+filename }), true);
    }).timeout(15000);

    it("CreateObject_CreateObjectBucketNotExist_Success", async () => {

        //given
        assert.strictEqual(await bucket.exists({ objectUrl: bucketUrl() }), false);
        assert.strictEqual(await bucket.exists({ objectUrl: bucketUrl()+"/"+filename }), false);
        //when
        await bucket.createObject({ objectUrl: bucketUrl()+"/"+filename, filePath: fullPathToFile });
        //then
        assert.strictEqual(await bucket.exists({ objectUrl: bucketUrl()+"/"+filename }), true);
    }).timeout(15000);

    it("DownloadObject_NominalCase_Success", async () => {

        var pathFileDownloaded = fullPathToDestination + "downloaded." + filename
        //given 
        await bucket.createObject({ objectUrl: bucketUrl()+"/"+filename, filePath: fullPathToFile });
        assert.strictEqual(await bucket.exists({ objectUrl: bucketUrl() }), true)
        // when
        await bucket.downloadObject({ objectUrl: bucketUrl()+"/"+filename, destinationUri: pathFileDownloaded });
        //then
        assert.strictEqual(fs.existsSync(pathFileDownloaded), true);
    }).timeout(15000);

    it("DownloadObjectURL_NominalCase_Success", async () => {

        var pathFileDownloaded = fullPathToDestination + "downloaded.site.html"
        //given 
        await bucket.createObject({ objectUrl: bucketUrl()+"/"+filename, filePath: myURL });
        assert.strictEqual(await bucket.exists({ objectUrl: bucketUrl() }), true)
        // when
        await bucket.downloadObject({ objectUrl: bucketUrl()+"/"+filename, destinationUri: pathFileDownloaded });
        //then
        assert.strictEqual(fs.existsSync(pathFileDownloaded), true);
    }).timeout(15000);

    it("Exists_NominalCase_Success", async () => {

        //given
        await bucket.createObject({ objectUrl: bucketUrl() });
        //when
        var input = await bucket.exists({ objectUrl: bucketUrl() });
        //then
        assert.strictEqual(input, true);
    }).timeout(15000);

    it("Exists_ObjectNotExistBucket_Success", async () => {

        //given
        var notExistingBucket = "notExistingBucket"
        //when
        var input = await bucket.exists({ objectUrl: notExistingBucket });
        //then
        assert.strictEqual(input, false);
    }).timeout(15000);

    it("Exists_ObjectNotExistFile_Success", async () => {

        //given
        await bucket.createObject({ objectUrl: bucketUrl() });
        assert.strictEqual(await bucket.exists({ objectUrl: bucketUrl() }), true);
        //when
        var input = await bucket.exists({ objectUrl: "notExistingFile.jpg" });
        //then
        assert.strictEqual(input, false);
    }).timeout(15000);

    it("RemoveObject_EmptyBucket_Success", async () => {
        //given
        await bucket.createObject({ objectUrl: bucketUrl() });
        assert.strictEqual(await bucket.exists({ objectUrl: bucketUrl() }), true);
        //when
        await bucket.removeObject({ objectUrl: bucketUrl() });
        //then
        assert.strictEqual(await bucket.exists({ objectUrl: bucketUrl() }), false);
    }).timeout(15000);

    it("RemoveObject_NotEmptyBucket_Success", async () => {
        //given          
        await bucket.createObject({ objectUrl: bucketUrl()+"/"+filename, filePath: fullPathToFile });
        assert.strictEqual(await bucket.exists({ objectUrl: bucketUrl() }), true);
        assert.strictEqual(await bucket.exists({ objectUrl: bucketUrl()+"/"+filename, filePath: fullPathToFile }), true);
        //when
        await bucket.removeObject({ objectUrl: bucketUrl() });
        //then
        assert.strictEqual(await bucket.exists({ objectUrl: bucketUrl() }), false);
    }).timeout(15000);
});
