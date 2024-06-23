


export function deleteValueFromArray(value, array){
   for(let i = 0; i < array.length; i++){
      if(array[i] === value){
         array.splice(i,1);
         break;
      }
   }
}

export function getPreviewFromText(text){
   if(window.globals.pageTestVersion === 'b'){
      return text;
   }
   if(!text) return '';
   let tokens = text.split(' ');
   let retString = '';
   for(let i = 0; i < 4 && i < tokens.length; i++){
      retString += tokens[i] + ' ';
   }
   return retString.trim();
}

export function getParameterByName(name, url) {
   if (!url) return null;
   name = name.replace(/[\[\]]/g, "\\$&");
   let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
   if (!results) return null;
   if (!results[2]) return '';
   return decodeURIComponent(results[2].replace(/\+/g, " "));
}

export function updateUrlParameter(key, value){
   let params = new URLSearchParams(window.location.search);
   if(params.get(key) === value)
      return null;
   params.set(key, value);
   return window.location.origin + window.location.pathname + '?' + params.toString()
}

export function removeDuplicatesFromArrayByProp(inputArray, prop) {
   return inputArray.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
   });
}
