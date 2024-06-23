
const baseURL = (typeof(window) !== 'undefined' ? window.location.origin : null) ;
import * as Ajax from './ajax';


/* Some Example Functions */
export function getProfileData(idUser){
   return Ajax.get(baseURL + '/users/getProfileData', {idUser});
}

export function getCurrentUserData(){
   return Ajax.get(baseURL + '/users/getCurrentUserData');
}

export function changePassword(oldPassword, password){
   return Ajax.post(baseURL + "/users/changeMyPassword", {oldPassword, password});
}
