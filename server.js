let dotEnvPath = 'dev.env';

const argv = require('minimist')(process.argv.slice(2));
if(argv.dotEnvPath)
   dotEnvPath=argv.dotEnvPath;

require('dotenv').config({path: dotEnvPath});
const express = require('express');
const flash = require('connect-flash');
const app = express();
const http = require('http').Server(app);
app.use(express.static(__dirname + '/public'));
global.publicFolder = __dirname + '/public';
const bll = require('./source/js/server/bll.js');
const bodyParser = require('body-parser');



app.set('view engine', 'html');
app.engine('html', require('hbs').__express);


app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());


function handleAjaxError(err, res, defaultMessage){
   res.status(500);
   if(err.internalMessage)
      console.log(`${err.exceptionType}(${err.id}): ${err.internalMessage}`);
   else //if(process.env.NODE_ENV === 'development')
      console.log(err);

   if(err.publicMessage)
      res.send(JSON.stringify({message: err.publicMessage}));
   else
      res.send(JSON.stringify({message: defaultMessage}));
}

function setJsonHeader(req, res, next){
   res.setHeader('Content-Type', 'application/json');
   next();
}



app.get('/', function (req, res) {
   res.render(__dirname + '/index.html', {});
});
app.get('/flappy', function (req, res) {
   res.render(__dirname + '/pages/flappyOs.html', {});
});

app.get('/app', function (req, res) {
   const data = {
      STATIC_ASSETS_BASE_URL: process.env.STATIC_ASSETS_BASE_URL,
      JS_VERSION: 1,
   };
   res.render(__dirname + '/views/app.html', data);
});

app.get('/initialDataFetch', setJsonHeader, function(req, res){
   bll.getAppsForUser().then(function(apps){
      res.send(JSON.stringify({responseType:'success', data: {apps} }));
   },function(err){
      handleAjaxError(err, res, 'Could not get app settings.');
   })
});

app.post('/saveAppSettings', setJsonHeader, function (req, res) {
   bll.updateAppSettings().then(() => {
      res.send(JSON.stringify({responseType:'success'}));
   }, (err) => {
      handleAjaxError(err, res, 'Error Updating Settings');
   });
});


let listenPort = process.env.PORT || 3000;

let server = http.listen(listenPort, function () {
   let host = server.address().address;
   let port = server.address().port;

   let date = new Date();

   console.log("App listening at http://%s:%s", host, port);
   console.log('Current Time: ' + date);

});


