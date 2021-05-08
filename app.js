// Add dependencies
const express = require("express");
const bodyParser = require("body-parser");
const mailchimp = require("@mailchimp/mailchimp_marketing");

// Setup express
const app = express();

// Config static pages and body-parser
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

// setup homepage route
app.get ("/", function (req, res) {
   res.sendFile(__dirname + "/signup.html");
});

// Configure mailchimp api
mailchimp.setConfig({
    apiKey: process.env.API_KEY,
    server: process.env.SERVER,
});

// Setup post method
app.post("/", function (req, res) {
    // Body-parse user information
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.eName;
    const listId = process.env.LIST_ID;
        
    async function run() {
        try {
            const response = await mailchimp.lists.addListMember(listId, {
                "email_address": email,
                "status": "subscribed",
                "merge_fields": {
                    "FNAME": firstName,
                    "LNAME": lastName
                }
            });

            res.sendFile(__dirname + "/success.html");
        } catch (error) {

            console.log(error);
            res.sendFile(__dirname + "/failure.html");
        }
    }

    run ();

});

// Listen to localhost and heroku server
app.listen(process.env.PORT || 3000, function() {
    console.log("Server is running on port 3000");
});