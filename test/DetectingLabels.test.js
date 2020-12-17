// import entire SDK
var Bucket = require('../class/Bucket');
var DetectingFaces = require('../class/DetectingFaces');
var fs = require('fs');
const assert = require("assert");
var bucketNumber = 1;
const imgName = "imgTest.png"
const fullPathToImage = __dirname + "/../" + imgName

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
    afterEach(async () => {
        
    })
    
    it("makeAnalysisRequest_AnalyseLocalImage_Success", async () => {
        //given
        assert.strictEqual(fs.existsSync(fullPathToImage), true);
        //when
        res = await detectingFaces.DetectingFaces({ imageUri: fullPathToImage });
        //then
        assert.strictEqual(Object.keys(res).length, 10);
    }).timeout(15000);

    it("makeAnalysisRequest_AnalyseBucketImage_Success", async () => {
        //given
        assert.strictEqual(await bucket.exists({ objectUrl: bucketUrl()+"/"+imgName }), false);
        //when
        res = await bucket.createObject({ objectUrl: bucketUrl()+"/"+imgName });
        //then
        assert.strictEqual(Object.keys(res).length, 10);
    }).timeout(15000);

    
});
