/**
 * This is where all models that are shared between client and server are defined
 * @module sharedModels
 */


/* Example from CMS */
exports.VersionedObject = class VersionedObject{
   /**
    * Update the object
    * @param {number} data.idReplacedBy
    * @param {boolean} data.isDev
    */
   update(data) {
      this.idReplacedBy = data.idReplacedBy;
      this.isDev = data.isDev;
   }

   /**
    * constructor just calls the update function
    * @param {object} data - object that the update function looks through to extract data from
    */
   constructor(data) {
      this.update(data);
   }
}
