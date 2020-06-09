const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');


const app = express();
const port = process.env.PORT || 4000;
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.post('/webhook',(req,res) => {
    let reply_token = req.body.events[0].replyToken;
    reply(reply_token);
    res.sendStatus(200);
});
app.listen(port);

function reply(reply_token){
    let headers = {
        'Content-type': 'application/json',
        'Authentication': 'Bearer GBrEiGkGX0EZnU39JQZPJbCx7ui1c1u3/FvRKp3v0tQWEyEQa4Ob1Bgq+ZbjnZbgNqwyZA38gKPU1XC5DIu4VoprUL1cvFWwLDzfwXzP45n/zHRZ+Mi9JYbNuZetPzJKTctCot2iUDqS8B/2w4ZPJwdB04t89/1O/w1cDnyilFU='
    }

    let body = JSON.stringify({
        replyToken: reply_token,
        messages: [{
            type: 'text',
            text: 'Hello'
        },
        {
            type: 'text',
            text: 'How are you?'
        }]
    })
    request.post({
        url: 'https://api.line.me/v2/bot/message/reply',
        headers: headers,
        body: body
    }, (err, res, body) => {
        console.log('status = ' + res.statusCode);
    });
}