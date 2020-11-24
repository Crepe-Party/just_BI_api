module.exports = class AbstractBucketManager{
    constructor() {
      if (this.constructor === AbstractBucketManager) {
        throw new TypeError('Abstract class "AbstractBucketManager" cannot be instantiated directly');
      }
    }
    
    async createObject({objectUrl, filePath = ""}){
      throw new Error('You must implement this function');
    };
    async exists({objectUrl}){
      throw new Error('You must implement this function');
    };
    async removeObject({objectUrl}){
      throw new Error('You must implement this function');
    };
    async downloadObject({objectUrl, destinationUri}){
      throw new Error('You must implement this function');
    };
}