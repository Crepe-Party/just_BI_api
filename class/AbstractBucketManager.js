class AbstractBucketManager{
    constructor() {
      if (this.constructor === AbstractBucketManager) {
        throw new TypeError('Abstract class "AbstractBucketManager" cannot be instantiated directly');
      }
    }
    
    async CreateObject(objectUrl, filePath = ""){
      throw new Error('You must implement this function');
    };
    async Exists(objectUrl){
      throw new Error('You must implement this function');
    };
    async RemoveObject(objectUrl){
      throw new Error('You must implement this function');
    };
    async DownloadObject(objectUrl, destinationUri){
      throw new Error('You must implement this function');
    };
}