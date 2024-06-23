/* Core Ajax functionality */

function onLoad(request, resolve, reject){
   if (request.status >= 200 && request.status < 400) {
      let returnedData = JSON.parse(request.responseText);
      if(returnedData.responseType === 'error') {
         reject(returnedData.message);
      }
      else if(returnedData.responseType === 'success'){
         resolve(returnedData.data);
      }
      else{
         reject('Could not get data from server.');
      }
   } else {
      alert('Your session has timed out');
      console.log('no access to ' + url);
      reject();
   }
}

function onError(url){
   alert('Could not connect to server');
   console.log('no access to ' + url);
}


export function post(url,data){
   return new Promise((resolve, reject) => {
      let request = new XMLHttpRequest();
      request.open('POST', url);
      request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

      request.onload = () => {onLoad(request, resolve, reject)};

      request.onerror = function() {
         onError(url);
         reject();
      };

      request.send(data);
   });
}

export function get(url, data){
   return new Promise((resolve, reject) => {
      let request = new XMLHttpRequest();
      request.open('GET', url);

      request.onload = () => {onLoad(request, resolve, reject)};

      request.onerror = function() {
         onError(url);
         reject();
      };

      request.send();
   });
}

/*
export function upload = function(url, data, additionalData = ''){
   return new Promise((resolve, reject) => {
      let fd = new FormData();
      fd.append( 'data', data );
      fd.append( 'additionalData', additionalData);

      $.ajax({
         type: "POST",
         url,
         success: function (data) {
            resolve(data);
         },
         error: function (error) {
            reject(error);
         },
         async: true,
         data: fd,
         cache: false,
         contentType: false,
         processData: false,
         timeout: 60000
      });
   });
};
*/