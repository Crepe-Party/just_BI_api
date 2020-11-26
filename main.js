var Bucket = require("./class/Bucket");

async function diogoFaitSesTests2(){
    var a = new Bucket()    
    try{
        var bucket = await a.destroy()
        console.log(bucket)
    }
    catch(e)
    {
        console.error(e)
    }

}
async function diogoFaitSesTests(){
    var a = new Bucket()    
    try{
        var bucket = await a.createBucket()
        console.log(bucket)
    }
    catch(e)
    {
        console.error(e)
    }
}
diogoFaitSesTests()