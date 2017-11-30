// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var ParseDashboard = require('parse-dashboard');

var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

var dashboard = new ParseDashboard({
  "allowInsecureHTTP" : true,
  "apps": [
    {
      "serverURL": "/parse",
      "appId": process.env.APP_ID || "myAppId",
      "masterKey": process.env.MASTER_KEY || "myMasterKey",
      "appName": "MyApp"
    }
  ],
  "users": [
    {
      "user":"pratigya",
      "pass":"admin123"
    }
  ]
}, true);


var androidPushConfig = {
  senderId: process.env.GCM_SENDER_ID || "201620464439",
  apiKey : process.env.GCM_API_KEY || "AIzaSyD7DLcuA6KSVkYBVakpk_9MOAmKZt8GksA"
};

var iosPushConfig = {
  pfx: 'Certificates.p12',
  passphrase:'admin123',
  bundleId:'com.ionicframework.mapapp',
  production: true
};

var api = new ParseServer({
  push: {
    android: androidPushConfig
  },
  serverURL: process.env.SERVER_URL || "https://your-app-name.herokuapp.com/parse",
  databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'myAppId',
  masterKey: process.env.MASTER_KEY || '' //Add your master key here. Keep it secret!
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);
app.use('/dashboard', dashboard);

app.get('/', function(req, res) {
  res.status(200).send('I dream of being a web site.');
});

var port = process.env.PORT || 1337;
app.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});
