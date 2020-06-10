// Reply with two static messages

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const port = process.env.PORT || 4000
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.post('/webhook', (req, res) => {
    console.log(req.body);
    console.log();
    console.log(req.body.events);

    let reply_token = req.body.events[0].replyToken;
    let menu_msg = req.body.events[0].message.text;

    if(menu_msg[0]==1) 
        console.log("Menu: "+ menu_msg[0]);

    if(menu_msg[0]==2) 
        console.log("Menu: "+ menu_msg[0]);

    if(menu_msg[0]==3) 
        console.log("Menu: "+ menu_msg[0]);            

    reply(reply_token,menu_msg);
    res.sendStatus(200);
})
app.listen(port)

function reply(reply_token,menu) {
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer GBrEiGkGX0EZnU39JQZPJbCx7ui1c1u3/FvRKp3v0tQWEyEQa4Ob1Bgq+ZbjnZbgNqwyZA38gKPU1XC5DIu4VoprUL1cvFWwLDzfwXzP45n/zHRZ+Mi9JYbNuZetPzJKTctCot2iUDqS8B/2w4ZPJwdB04t89/1O/w1cDnyilFU='
    }

    let body="";
    if(menu == 1){
        body = JSON.stringify({
            replyToken: reply_token,
            messages: [{
                type: 'text',
                text: 'กำลังใช้เครื่องไหนบ้างคะ (Which machine you using?)'
            },
            {
                type: 'text',
                text: 'เช่น 93 100 (Ex. 93 100)'
            }]
        })
    }

    if(menu == 2){
        body =JSON.stringify({
            replyToken: reply_token,
            messages: [{
                type: 'text',
                text: 'จองคิวเครื่องไหนบ้างคะ (Which machine would you like to book?)'
            },
            {
                type: 'text',
                text: 'เช่น 93 100 (Ex. 93 100)'
            }]
        })
    }

    if(menu == 3){
        body = JSON.stringify({
            replyToken: reply_token,
            messages: [{
                type: 'text',
                text: 'กรุณารอสักครู่ (Wait a minute.)'
            }]
        })
    }

    request.post({
        url: 'https://api.line.me/v2/bot/message/reply',
        headers: headers,
        body: body
    }, (err, res, body) => {
        console.log('status = ' + res.statusCode);
    });
}