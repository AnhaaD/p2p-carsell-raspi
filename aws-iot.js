var awsIot = require('aws-iot-device-sdk');
var fs =require('fs');

var thingName ='BlockChainGarage';
var clientTokenUpdate;

console.log('loading iot ....');
var thingShadows = awsIot.thingShadow({
      keyPath: './certs/BlockChainGarage.private.key',
  certPath: './certs/BlockChainGarage.cert.pem',
    caPath: './certs/root-CA.crt',
  clientId: 'client12344567',
  region:'us-east-1',
  host:'a2c6vtfn7g8m57.iot.us-east-1.amazonaws.com'
});

thingShadows.register(thingName, {persistentSubscribe: true},function(){
		console.log(thingName+ ' registered');


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

module.exports.openGarage = function(){
      console.log('called openGarage');
      thingShadows.update(thingName, {
            state: {
               desired: {isDoorOpen:true}
            }
         });

};


module.exports.closeGarage = function(){
  console.log('called closeGarage');
  thingShadows.update(thingName, {
        state: {
           desired: {isDoorOpen:false}
        }
     });
};
