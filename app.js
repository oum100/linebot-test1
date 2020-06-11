// Reply with two static messages

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const port = process.env.PORT || 4000
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.post('/webhook', (req, res) => {
    //console.log(req.body);
    //console.log();
    console.log(req.body.events);

    let reply_token = req.body.events[0].replyToken;
    let menu_msg = req.body.events[0].message.text;
    let uid = req.body.events[0].source.userId;

    console.log(menu_msg);
    //getdispname(uid);

    reply(reply_token,menu_msg,getdispname(uid));
    res.sendStatus(200);
})
app.listen(port)

function reply(reply_token,menu,uname) {
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer GBrEiGkGX0EZnU39JQZPJbCx7ui1c1u3/FvRKp3v0tQWEyEQa4Ob1Bgq+ZbjnZbgNqwyZA38gKPU1XC5DIu4VoprUL1cvFWwLDzfwXzP45n/zHRZ+Mi9JYbNuZetPzJKTctCot2iUDqS8B/2w4ZPJwdB04t89/1O/w1cDnyilFU='
    }

    let body="";
    if(menu[0] == "N" || menu[0] == "n"){
        let assetid = menu.substr(1,3);
        body = JSON.stringify({
            replyToken: reply_token,
            messages: [{
                type: 'text',
                text: 'ตั้งเตือนของเครื่อง '+ assetid + ' ไปยัง ' + uname + ' เรียบร้อย ของคุณคะ'
            }]
        })
    }

    if(menu[0] == "B" ||menu[0]=="b"){
        let assetid = menu.substr(1,3);
        body =JSON.stringify({
            replyToken: reply_token,
            messages: [{
                type: 'text',
                text: 'จองคิวเครื่อง' + assetid
            }]
        })
    }

    if(menu[0] == 3){
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

function getdispname(uid){
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer GBrEiGkGX0EZnU39JQZPJbCx7ui1c1u3/FvRKp3v0tQWEyEQa4Ob1Bgq+ZbjnZbgNqwyZA38gKPU1XC5DIu4VoprUL1cvFWwLDzfwXzP45n/zHRZ+Mi9JYbNuZetPzJKTctCot2iUDqS8B/2w4ZPJwdB04t89/1O/w1cDnyilFU='
    }       
    request.get({
        url:'https://api.line.me/v2/bot/profile/'+uid,
        headers: headers
        },(err,res) => {
            if(res.statusCode == 200){
                let obj = JSON.parse(res.body).displayName;
                callback(obj);
            }else{
                callback(err||': Expected 200 status, But received: ' + res.statusCode + '\n' + res.body);
            }
        }
    );
}

function callback(str){
    console.log(str);
    return str;
}