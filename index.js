"use strict";
const Zbar = require('zbar');
const speaker = require('./speaker');
const verifier = require("./verify-purchase");
const AWS = require('aws-sdk');
AWS.config.update({region:'us-east-1'});
const rekognition = new AWS.Rekognition();
const sns = new AWS.SNS();
const s3 = new AWS.S3();
const PythonShell = require('python-shell');

const zbar = new Zbar('/dev/video1'); // connected to USB Webcam not Pi Cam

const awsIot = require('aws-iot-device-sdk');
const fs =require('fs');

const thingShadows = awsIot.thingShadow({
      keyPath: './certs/BlockChainGarage.private.key',
  certPath: './certs/BlockChainGarage.cert.pem',
    caPath: 'r./certs/oot-CA.crt',
  clientId: 'client12344567',
  region:'us-east-1',
  host:'a2c6vtfn7g8m57.iot.us-east-1.amazonaws.com'
});
const thingName ='BlockChainGarage';
var clientTokenUpdate;

console.log('scan your qr code');
zbar.stdout.on('data', function(buf) {
  console.log('data scanned : ' + buf.toString());
  try {
    var code = JSON.parse(buf.toString());
    verifier.verify(code,function(err,data){

        if(!err){
            if(data){
                speaker.speak('Congratulations ! Your ownership is verified. '+
                'You are being watched for security reasons.');
                console.log('+++++++++++++++++++++++++++++++++++++++++++++');
                console.log('Congratulations ! Your ownership is verified.');
                console.log('+++++++++++++++++++++++++++++++++++++++++++++');

                thingShadows.update(thingName, {
                   state: {
                      desired: {isDoorOpen: true}
                   }
                });

                sns.publish({
                            Message: 'Buyer has opened your garage. http://192.168.0.11:8081' ,
                            TopicArn: 'arn:aws:sns:us-east-1:027378352884:raspiFaceTextMessage'
                          }, function (err, data) {
                            if(err){

                            }else{

                            }

                });
            }else{
              speaker.speak('You are not a verified buyer. '+
              ' Details are sent to seller for futher action.');
                console.log('+++++++++++++++++++++++++++++++++++++++++++++');
                console.log('You are not a verified buyer.');
                console.log('+++++++++++++++++++++++++++++++++++++++++++++');
                sns.publish({
                            Message: 'Someone trying to steal your car. http://192.168.0.11:8081' ,
                            TopicArn: 'arn:aws:sns:us-east-1:027378352884:raspiFaceTextMessage'
                          }, function (err, data) {
                            if(err){

                            }else{

                            }

                });
            }
        }
    })

  }
  catch(error) {
    speaker.speak('You tried to scan invalid QR Code');
  }

});

//to run the program execute
//RPC_URL="https://sdwwtboydw.localtunnel.me" node .

zbar.stderr.on('data', function(buf) {
    console.log(buf.toString());
});


thingShadows.on('connect', function() {
        console.log('connected to AWS IOT' );
        thingShadows.register(thingName, {persistentSubscribe: true},function(){
                console.log(thingName+ ' registered');
               // var currentState = thingShadows.get(thingName);
                //console.log('current state', currentState);
                /*clientTokenUpdate = thingShadows.update(thingName, {"state":{"desired":{"isDoorOpen":false}}});
                if (clientTokenUpdate === null)
                {
                        console.log('update shadow failed, operation still in progress');
                }*/
        });


       thingShadows
      .on('error', function(error) {
         console.log('error', error);
      });

   thingShadows
      .on('delta', function(thingName, stateObject) {
         console.log('received delta on ' + thingName + ': ' +
            JSON.stringify(stateObject));
         thingShadows.update(thingName, {
            state: {
               reported: stateObject.state
            }
         });
      });
});
