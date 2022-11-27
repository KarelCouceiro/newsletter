const express = require('express');
const bodyparser = require('body-parser');
const request = require('request');
const https = require('https');
const jQuery = require('jquery');
const md5 = require('md5');
var fs = require('fs');

const app = express();
app.use(express.static('public'));
app.use(bodyparser.urlencoded({extended: true}));

api = process.env.api
audience_id = "8ecbd4ebbb";
var error_type = true;
const mailchimp = require("@mailchimp/mailchimp_marketing");

mailchimp.setConfig({
  apiKey: api,
  server: "us21",
});


const listId = audience_id;

app.post('/failure', function(req,res){

  res.redirect('/');
}


)

app.get('/', function(req, res){

  res.sendFile(__dirname + "/public/signup.html");

})

app.post('/', function(req, res){


const firstName = req.body.fName;
const lastName = req.body.lName;
const email = req.body.mail;


const data = {
  members: [
    {
      email_address: email,
      status: "subscribed",
merge_fields: {
  FNAME: firstName,
  LNAME: lastName


}
}
]
};
const jsonData = JSON.stringify(data);


url = "https://us21.api.mailchimp.com/3.0/lists/8ecbd4ebbb";

const options = {
  method: "POST",
  auth: "KCOU:" + api

}



const request = https.request(url, options, function(response){

    response.on('data', function(data){

    const dat = JSON.parse(data);

  //  console.log(dat);

    if (dat.error_count >0)                          {

      fs.writeFile(__dirname +"/public/data.txt", dat.errors[0].error_code, function(err) {
     if (err) {
         console.log(err);
        }
      });

     res.sendFile(__dirname + "/public/failure.html", options);

    }


  else if   (response.statusCode === 200){
    error_type = false;
    res.sendFile(__dirname + "/public/success.html");}

      else{
        error_type = true;
    res.sendFile(__dirname + "/public/failure.html");
  };
})
});


request.write(jsonData);
request.end();





});

app.listen(process.env.PORT || 3000, function() {
  console.log('Server started on port 3000');
});
