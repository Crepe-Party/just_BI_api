/**
 * Generic class used to manage an AWS or Google bucket
 */
module.exports = class AbstractBucketManager{
    /**
     * @constructor
     * 
     * Create an instance with credentials and secret key to acces on the AWS S3
     */
    constructor() {
      if (this.constructor === AbstractBucketManager) {
        throw new TypeError('Abstract class "AbstractBucketManager" cannot be instantiated directly');
      }
    }
    
    /**
     * Create an object on the bucket, create bucket if it not exists
     * @param {string} objectURL location on bucket (example awsnode.actualit.info/readme.md)
     * @param {string} filePath  where is the file local or url? (example with local file: c:\just_BI_api\readme.md, example with url: http://perdu.com/)
     * 
     * @return {boolean} return false when failed
     */
    async createObject({objectUrl, filePath = ""}){
      throw new Error('You must implement this function');
    };
    /**
     * check the existance of the object / bucket
     * @param {string} objectUrl location on bucket (example awsnode.actualit.info/readme.md)
     * @param {string} objectUrl the bucket (example awsnode.actualit.info)
     * 
     * @return {boolean} does it exist?
     */
    async exists({objectUrl}){
      throw new Error('You must implement this function');
    };
    /**
     * remove an object on the bucket
     * @param {string} objectURL location on bucket (example awsnode.actualit.info/readme.md)
     * 
     * @return {boolean} return false when failed
     */
    async removeObject({objectUrl}){
      throw new Error('You must implement this function');
    };
    /**
     * download an object of the bucket on a specific location
     * @param {string} objectUrl location on bucket (example awsnode.actualit.info/readme.md)
     * @param {string} destinationUri  where is the file has to download (example: c:\just_BI_API\downloaded_files\README.md)
     * 
     * @return {boolean} return if it was successful
     */
    async downloadObject({objectUrl, destinationUri}){
      throw new Error('You must implement this function');
    };
}