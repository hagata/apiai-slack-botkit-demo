'use strict';

const Botkit = require('botkit');
const apiaibotkit = require('../api-ai-botkit');

const slackToken = process.env.SLACK_TOKEN;
const apiaiToken = process.env.APIAI_TOKEN;

const apiai = apiaibotkit(apiaiToken);
const controller = Botkit.slackbot();

controller.hears('.*', ['direct_message', 'direct_mention', 'mention'], function (bot, message) {
    apiai.process(message, bot);
});

controller.on('reaction_added', function (bot, message) {
   console.log(message);
});

apiai.all(function (message, resp, bot) {
    console.log(resp.result.action);
    console.log(`[USER] -> "${resp.result.resolvedQuery}"`);
});

apiai
    .action('smalltalk.greetings', function (message, resp, bot) {
        var responseText = resp.result.fulfillment.speech;
        bot.reply(message, responseText);
    })
    .action('echo.idea', (message, resp, bot) => {
        let responseText = resp.result.fulfillment.speech;
        bot.reply(message, responseText)
    })
    .action('input.unknown', function (message, resp, bot) {
        bot.reply(message, "Sorry, I don't understand");
    });

controller.spawn({
    token: slackToken
}).startRTM();