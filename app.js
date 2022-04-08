const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const client = require("@mailchimp/mailchimp_marketing");

client.setConfig({

  apiKey: "20013dfb449b29fcc855942a4b9a0",

  server: "us14",

});

const app = express();
const port = 3000;

app.use(express.static("public"));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html")
})

app.post("/", function(req, res) {
  var firstName = req.body.fName;
  var lastName = req.body.lName;
  var email = req.body.email;

  const data = {
    members:[
    {
      email_address: email,
      status: "subscribed",
      merge_fields: {
       FNAME: firstName,
       LNAME: lastName,
     }
    }]
  }

  const jasonData = JSON.stringify(data);

  const url =  "https://us14.api.mailchimp.com/3.0/lists/9b0917b8a1";

  const options = {
    method: "POST",
    auth: "tilak:Sadac7820013dfb449b29fcc855942a4b9a0-us14"
  }

  const request = https.request(url , options , function(response){

    if(response.statuscode == "subscribed" ){
      res.sendFile(__dirname + "/Success.html");
      console.log(response.statuscode);
    }
    else{
      res.sendFile(__dirname + "/failure.html");
      console.log(response.statuscode);
    }

    response.on("data" , function(data){
      console.log(JSON.parse(data));
    })
  })

  request.write(jasonData);
  request.end();
});

app.post("/failure" , function(req , res){
  res.redirect("/");
});

app.listen(process.env.PORT || port, function() {
  console.log("listning on port " + port);
})

//url
// https://us6.api.mailchimp.com/3.0/

//api
// c7820013dfb449b29fcc855942a4b9a0-us14

//list id
// 9b0917b8a1
