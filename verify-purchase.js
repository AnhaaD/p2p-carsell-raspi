/**
 * Created by appstacksoultions.com on 1/24/18.
 */
var Web3 = require('web3');

var rpcUrl = process.env.RPC_URL || 'http://localhost:8545';

console.log('rpcUrl',rpcUrl);

var web3 =new Web3(new Web3.providers.HttpProvider(rpcUrl));


module.exports.verify = function(input, callback){

    console.log('Verifying ownership in ethereum blockchain');

    var  carsellContract = web3.eth.contract([{"constant":true,"inputs":[],"name":"verifyOwnership","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"buy","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"getCar","outputs":[{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"uint256"},{"name":"","type":"bool"},{"name":"","type":"address"},{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isSold","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"make","type":"string"},{"name":"model","type":"string"},{"name":"year","type":"string"},{"name":"price","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]);

    var deployedContract = carsellContract.at(input.address);


    deployedContract.verifyOwnership.call({from:input.owner},function(err, returnValues){

        if(err){
                callback(err);
        }else{
                callback(null,returnValues);
        }
    })
}
