// import entire SDK
var Bucket = require('../class/Bucket');
var DetectingFaces = require('../class/DetectingFaces');
const fs = require('fs');
const assert = require("assert");
var bucketNumber = 1;
const imgName = "gandhi.png"
const fullPathLocalImage = `${__dirname}/${imgName}`

function bucketUrl(){
    return "awsnode"+bucketNumber+".actualit.info"
}

var bucket = new Bucket();
var detectingFaces = new DetectingFaces();
// when you execute all test winth "npm test", random tests fail...
// but if you use "mocha -g name_of_test" each test pass
describe("init", () => {
    before(function (done) {
        this.timeout(15000)
        setTimeout(function () {
            done() //we wait 5sec, beacause aws require a few times after each bucket delete
        }, 5000)
    })
    
    it("makeAnalysisRequest_AnalyseLocalImage_Success", async () => {
        //given
        assert.strictEqual(fs.existsSync(fullPathLocalImage), true);
        //when
        res = await detectingFaces.makeAnalysisRequest({ imageUri: fullPathLocalImage });
        //then
        assert(Object.values(res.FaceDetails[0]).length <= 10);
    }).timeout(15000);

    it("makeAnalysisRequest_AnalyseBucketImage_Success", async () => {
        //given
        await bucket.createObject({ objectUrl: bucketUrl()+"/"+imgName, filePath: fullPathLocalImage });
        assert.strictEqual(await bucket.exists({ objectUrl: bucketUrl()+"/"+imgName }), true);
        //when
        res = await detectingFaces.makeAnalysisRequest({ imageUri: bucketUrl()+"/"+imgName });
        //then
        assert(Object.values(res.FaceDetails[0]).length <= 10);
    }).timeout(15000);

    
});
