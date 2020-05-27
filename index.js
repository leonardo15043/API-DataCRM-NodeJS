
const request = require('request');
const needle = require('needle');
const md5 = require('md5');
let urlCRM = "https://server2.datacrm.la/datacrm/sanofi/webservice.php?";

async function login(){

let operation = "getchallenge";
let username = "frenteweb";
let accessKey = "12345";

    let response_getToken = await needle('get', `${urlCRM}operation=${operation}&username=${username}`, { headers: { 'accept': 'application/json'} });

    let options = {
      'method': 'POST',
      'url': urlCRM,
      'headers': {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
     form: {
        'operation': 'login',
        'username': username,
        'accessKey': accessKey,
        'token': md5(response_getToken.body.result.token)
     }
    };

     let promise = new Promise(function (resolve, reject) {
        request.post(
            options
        ,  function (err, res, body) {
            if (err) {
               console.log('error: ', err, body);
               reject(err);
            } else {
               resolve(JSON.parse(body));
            }
        });
    });

    return promise;

}

async function getDescribe() {
  await login().then( async function(ses) {
    let response_dataDescribe = await needle('get', `${urlCRM}operation=describe&sessionName=${ses.result.sessionName}&elementType=Certificates`, { headers: { 'accept': 'application/json' }});
    console.log(response_dataDescribe.body);
    return response_dataDescribe.body
  });
}

getDescribe();
