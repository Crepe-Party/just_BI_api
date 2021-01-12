module.exports = class AbstractDetectingFacesManager{
    /**
     * @constructor
     * 
     * Create an instance with credentials and secret key to acces on the AWS S3
     */
    constructor() {
      if (this.constructor === AbstractDetectingFacesManager) {
        throw new TypeError('Abstract class "AbstractDetectingFacesManager" cannot be instantiated directly');
      }
    }
    
    /**
     * Analyse image from local or bucket aws
     * @param {string} imageUri image local or on a bucket aws
     * @param {int} maxFaces number of result to return
     * @param {int} minConfidence % confidence min of result to include of return
     * 
     * @retun {Array} return array of result
     */
    async makeAnalysisRequest({imageUri, maxFaces = 10, minConfidence = 80}){
      throw new Error('You must implement this function');
    };
}