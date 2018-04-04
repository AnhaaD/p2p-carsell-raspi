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
const garage = require('./aws-iot');
const myip = require('quick-local-ip');

console.log('scan your qr code');
zbar.stdout.on('data', function(buf) {
  console.log('data scanned : ' + buf.toString());
  try {
    var code = JSON.parse(buf.toString());
    verifier.verify(code,function(err,data){

        if(!err){
            if(data){
                speaker.speak('Your ownership is verified successfully. Garage will open now. '+
                'You are being watched for security reasons.');
                console.log('+++++++++++++++++++++++++++++++++++++++++++++');
                console.log('Congratulations ! Your ownership is verified.');
                console.log('+++++++++++++++++++++++++++++++++++++++++++++');

                setTimeout(function(){
                  garage.openGarage();

                    setTimeout(function(){
                      garage.closeGarage();
                    },1000*60*2)


                },10000)

                sns.publish({
                            Message: 'Buyer has opened your garage. http://'+myip.getLocalIP4()+':8081' ,
                            TopicArn: 'arn:aws:sns:us-east-1:027378352884:p2pCarSell'
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
                            Message: 'Someone trying to steal your car. http://'+myip.getLocalIP4()+':8081' ,
                            TopicArn: 'arn:aws:sns:us-east-1:027378352884:p2pCarSell'
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
