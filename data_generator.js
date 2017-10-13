const stitch = require("mongodb-stitch"); // Set-up the MongoDB connection
const chance = require("chance").Chance(); // Package for random variables
const dotenv = require('dotenv').config();

const express = require('express');
const app     = express();

// Seeds for the random data
const LOCATIONS = ["Store 1", "Store 2", "Store 3"];
const TOPPINGS = ["Pepperoni", "Mushrooms", "Onions", "Sausage", "Bacon", "Extra cheese", "Black olives", "Green peppers", "Pineapple","Spinach"];
const SIZES = ["Personal", "Small", "Medium", "Large", "X-tra Large"];

// Set-up DB Connection
const client = new stitch.StitchClient('salesdashboard-jsydw');
const db = client.service("mongodb", "mongodb-atlas").db("SalesReporting");
const salesData = db.collection("Receipts");

// Send sample data while within this loop
function generateReceipts(){
  // Create a random transaction
  const receipt = {
    "timestamp" : Date.now(),
    "customerName" : chance.name({ nationality: "en" }),
    "cardNumber" : chance.cc(),
    "location" : chance.weighted(LOCATIONS, [2, 5, 3]),
    "size" : chance.weighted(SIZES, [1, 2, 3, 4, 5]),
    "toppings" : chance.weighted(TOPPINGS,[1, 1, 1, 1, 1, 1, 1, 1, 1, 1]),
    "total" : parseFloat(chance.normal({mean: 20, dev: 3}).toFixed(2))
  };

  // Print to the console
  console.log(receipt);

  // Insert into MongoDB
  salesData.insertOne(receipt).then(
    // Wait for a random amount of time
    setTimeout(generateReceipts, chance.integer({min: 0, max: 1000}))
  );
}

// Authenticate anonymously and then begin to load data
client.login().then(generateReceipts);

// Alternatively Use the API Key to load data more securely
// client.authenticate("apiKey", process.env.API_KEY).then(generateReceipts);

app.set('port', (process.env.PORT || 5000));

app.get('/', function(request, response) {
    response.sendFile('index.html');
}).listen(app.get('port'), function() {
    console.log('App is running, server is listening on port ', app.get('port'));
});
