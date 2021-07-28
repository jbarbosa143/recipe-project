require('dotenv').config();
const express = require("express");
const router = express.Router();
const jwtMiddleware = require("../utils/jwtMiddleware");

const accountSid = process.env.TWILIO_ACCT_SID;
const authToken = process.env.TWILIO_ACCT_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

router.post("/send-sms", jwtMiddleware, function (req, res) {
  client.messages
    .create({
      body: req.body.message,
      from: "+114437762134", //if you paid for the api service it will be your real number
      to: `+1${req.body.to}`, //and you can send real text message to your friends, family, and strangers... but dont do that
    })
    .then((message) => res.json(message))
    .catch((error) => {
      console.log(error.message);

      res.status(error.status).json({ message: error.message, error });
    });
});

module.exports = router;
