require('dotenv').config()


const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const { Stats } = require("fs");


const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");

});

app.post("/", function (req, res) {

    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    var data = {
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

    var jsonData = JSON.stringify(data);

    const url = "https://us14.api.mailchimp.com/3.0/lists/2bb103f4f4";

    const options = {
        method: "POST",
        auth: "amit:c4b072430e88424899330021f8748b73-us14"
    }

    const request = https.request(url, options, function (response) {

        if(response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        }else{
            res.sendFile(__dirname+ "/failure.html");
        }

        response.on("data", function (data) {
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData)
    request.end();
});

app.post("/failure", function(req,res){
    res.redirect("/");
})



app.listen(process.env.PORT || 8080, function () {
    console.log("Server is started on port 8080.")
})

