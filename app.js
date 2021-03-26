const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { post } = require("request");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
    var firstName = req.body.fName;
    var lastName = req.body.lName;
    var email = req.body.email;

    var data = {
        members: [{  //key value pair
            email_address: email, 
            staus: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    };
    const jsonData = JSON.stringify(data);

    const url = "https://us1.api.mailchimp.com/3.0/lists/3bbfb41934";

    const options = {
        method: "POST",
        auth: "anirudh1:800feee844753a1ee700111780bbc5ea-us1"
    }
      
    const request = https.request(url, options, function(response){

        if (response.statusCode === 200){
            res.sendFile(__dirname + "/success.html")
        }
        else{
            res.sendFile(__dirname + "/failure.html")
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();

});

app.post("/failure", function(req, res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(){   //dynamic port, heroku determines which port to use, can be 3000 or anything else
    console.log("Listening on port: 3000 ");   // now it works on heroku and locally
});


//800feee844753a1ee700111780bbc5ea-us1  -- apikey 

//3bbfb41934 --list id // added to the last of url 
