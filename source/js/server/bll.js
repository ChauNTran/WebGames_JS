/**
 * Business Logic module
 * @module bll
 */

const SharedModels = require('../../../shared/sharedModels');

exports.getTargetJsVersion = function(){
   return '1';
};

/**
 * Gets top-level info for all apps the user has access to
 */
exports.getAppsForUser = function(){
   return [1, 2, 3];
};

exports.updateAppSettings = function(){
   return "This doesn't actually do anything"
};
