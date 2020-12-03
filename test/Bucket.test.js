// import entire SDK
var Bucket = require('../class/Bucket');
var fs = require('fs');
const assert = require("assert");
const bucketUrl = "awsnodecrash.actualit.info"
const filename = "README.md"
const fullPathToFile = __dirname + "/../" + filename
const fullPathToDestination = __dirname + "/../"
const fileUrl = bucketUrl + "/" + filename

describe("init", () => {
    var bucket = null;
    beforeEach(() => {
        bucket = new Bucket();
    })

    afterEach(async () => {
        if(await bucket.exists({objectUrl: bucketUrl}))
            await bucket.removeObject({objectUrl: bucketUrl})
    })

    it("CreateObject_CreateNewBucket_Success", async () => { //done
        //given
        assert.strictEqual(await bucket.exists({ objectUrl: bucketUrl }), false);
        //when
        await bucket.createObject({ objectUrl: bucketUrl });
        //then
        assert.strictEqual(await bucket.exists({ objectUrl: bucketUrl }), true);
    });

    it("CreateObject_CreateObjectWithExistingBucket_Success", async () => {
            //given  
            await bucket.createObject({ objectUrl: bucketUrl });
            assert.strictEqual(await bucket.exists({ objectUrl: bucketUrl }), true);
            assert.strictEqual(await bucket.exists({ objectUrl: fileUrl }), false);
            //when
            await bucket.createObject({ objectUrl: fileUrl, filePath: fullPathToFile });
            //then
            assert.strictEqual(await bucket.exists({ objectUrl: fileUrl }), true);
            console.log("fini wesh")
    });

    it("CreateObject_CreateObjectBucketNotExist_Success", async (done) => {

        //given
        assert.strictEqual(await bucket.exists({ objectUrl: bucketUrl }), false);
        assert.strictEqual(await bucket.exists({ objectUrl: fileUrl }), false);
        //when
        await bucket.createObject({ objectUrl: fileUrl, filePath: fullPathToFile });
        //then
        assert.strictEqual(await bucket.exists({ objectUrl: fileUrl }), true);
        done()
    })

    it("DownloadObject_NominalCase_Success", async (done) => {

        var pathFileDownloaded = fullPathToDestination + "downloaded." + filename
        //given 
        await bucket.createObject({ objectUrl: fileUrl, filePath: fullPathToFile });
        assert.strictEqual(await bucket.exists({ objectUrl: bucketUrl }), true)
        //when
        await bucket.downloadObject({ objectUrl: fileUrl, destinationUri: pathFileDownloaded });
        //then
        assert.strictEqual(fs.existsSync(pathFileDownloaded), true);
        done()
    });

    it("Exists_NominalCase_Success", async (done) => {

        //given
        await bucket.createObject({ objectUrl: bucketUrl });
        //when
        var input = await bucket.exists({ objectUrl: bucketUrl });
        //then
        assert.strictEqual(input, true);
        done()
    });

    it("Exists_ObjectNotExistBucket_Success", async (done) => {

        //given
        var notExistingBucket = "notExistingBucket"
        //when
        var input = await bucket.exists({ objectUrl: notExistingBucket });
        //then
        assert.strictEqual(input, false);
        done()
    });

    it("Exists_ObjectNotExistFile_Success", async (done) => {

        //given
        await bucket.createObject({ objectUrl: bucketUrl });
        assert.strictEqual(await bucket.exists({ objectUrl: bucketUrl }), false);
        //when
        var input = await bucket.exists({ objectUrl: "notExistingFile.jpg" });
        //then
        assert.strictEqual(input, false);
        done()
    });

    it("RemoveObject_EmptyBucket_Success", async (done) => {

        //given
        await bucket.createObject({ objectUrl: bucketUrl });
        assert.strictEqual(await bucket.exists({ objectUrl: bucketUrl }), true);
        //when
        await bucket.removeObject({ objectUrl: bucketUrl });
        //then
        assert.strictEqual(await bucket.exists({ objectUrl: bucketUrl }), false);
        done()
    });

    it("RemoveObject_NotEmptyBucket_Success", async (done) => {

        //given          
        await bucket.createObject({ objectUrl: fileUrl, filePath: filePath });
        assert.strictEqual(await bucket.exists({ objectUrl: bucketUrl }), true);
        assert.strictEqual(await bucket.exists({ objectUrl: fileUrl, filePath: filePath }), true);
        //when
        await bucket.removeObject({ objectUrl: bucketUrl });
        //then
        assert.strictEqual(await bucket.exists({ objectUrl: bucketUrl }), false);
        done()
    });
});