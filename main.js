var Bucket = require("./class/Bucket");

async function diogoFaitSesTests(){
    var a = new Bucket()
    console.log((await a.createBucket()).response)
}
