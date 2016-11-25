'use strict';
var config = require('./config');

let util = require('util');
let http = require('http');
let https = require('https');
let Bot  = require('@kikinteractive/kik');
let fs = require("fs");

// Configure the bot API endpoint, details for your bot
var config = require('./config');
var logFile = fs.createWriteStream('corporateanswers-bot.log', { flags: 'a' });

var responses = 
[
"That's not strategy. That's more execution.",
"Let's take a step back.",
"I have to let you know - I have concerns about this.",
"I think we should meet on this before we circle back so let's meet again on Monday.",
"I'm not sure this if on brand",
"Can you take an action item?",
"I don't really want to deep dive on this just now",
"Can you net out the bullet points for me?",
"At the end of the day, can we save we've opened the kimono on this?"
];

var last_response_no = 0;


var log_arguments; 

let bot = new Bot({
    username: config.kik.username,
    apiKey: config.kik.apiKey,
    baseUrl: config.app.baseUrl
});


var startmessages = [('Server started on port ' + (process.env.PORT || 8080) + '\n'), ('The Api key is ' + bot.apiKey + '\n')];

console.log(startmessages[0]);
console.log(startmessages[1]);
logFile.write(util.format.apply(null, startmessages) + '\n');

bot.updateBotConfiguration();



bot.onStartChattingMessage((message) => {
    bot.getUserProfile(message.from)
        .then((user) => {
            log_arguments = ["Message Received from: ", user.firstName + " " + user.lastName];
            logFile.write(util.format.apply(null, log_arguments) + '\n');
            
            message.reply(`Hey ${user.firstName}!`);
            message.reply('Welcome to corporateanswers. We are to help empower you with the the right response in any corporate setting at any time.');
            message.reply('In the middle of the meeting and unsure what to stay? Chat to us and using our cutting edge articifial intelligence algoritm we give you the perfect reponse.');
        });
});

function getRandom() {
    var ran_no;
    ran_no = Math.floor((Math.random() * responses.length) + 0);
    return ran_no;
}

bot.onTextMessage((message) => {
    var random_response_no;
    
    do {
       random_response_no = getRandom();
       console.log(random_response_no);
    } 
    while (last_response_no == random_response_no);
    
    var reply = responses[random_response_no];
    message.reply(reply);
    log_arguments=[message.from,":",reply, "(",random_response_no,")"];
    logFile.write(util.format.apply(null, log_arguments) + '\n');
    //message.reply(message.body);
});

// Set up your server and start listening
let server = http
    .createServer(bot.incoming())
    .listen(process.env.PORT || 8080);