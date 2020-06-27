// Reply with two static messages

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const rp = require('request-promise')
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
    let uname="";

    console.log(menu_msg);
    getdispname(uid).then(function(uname){
        console.log('getdisplayname: '+ uname);
        reply(reply_token,menu_msg,uname);
    });
    res.sendStatus(200);
})
app.listen(port)



function reply(reply_token,menu,uname) {
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer GBrEiGkGX0EZnU39JQZPJbCx7ui1c1u3/FvRKp3v0tQWEyEQa4Ob1Bgq+ZbjnZbgNqwyZA38gKPU1XC5DIu4VoprUL1cvFWwLDzfwXzP45n/zHRZ+Mi9JYbNuZetPzJKTctCot2iUDqS8B/2w4ZPJwdB04t89/1O/w1cDnyilFU='
    }
    let body="";
    let msgtxt = "";
    let assetid = menu.substr(1);
    if(Number(assetid)){
        switch (true){
            case menu[0] == "N" || menu[0]== "n":
                console.log('print N');
                msgtxt = 'ตั้งแจ้งเตือนเครื่อง '+ assetid + ' ให้คุณ \"' + uname + '\" เรียบร้อย';
                break;
            case menu[0] == "B" || menu[0]== "b":   
                console.log('print B');
                msgtxt = 'จองคิวเครื่อง '+ assetid + ' ให้คุณ \"' + uname + '\" เรียบร้อย';
                break;
            default:
                msgtxt = 'ไม่พบคำสั่ง กรุณาใส่คำสั่ง (N=แจ้งเตือน,B=จองคิว) และตามด้วยหมายเลขเครื่อง 3 หลัก เช่น N100 หรือ B440';
        }
        body = JSON.stringify({
            replyToken: reply_token,
            messages: [{
                type: 'text',
                text: msgtxt
            }]
        })
    }else if(menu[0] != "พ"){
        //msgtxt = 'หมายเลขเครื่องไม่ถูกต้อง : N=แจ้งเตือน หรือ B=จองคิว และตามด้วยหมายเลขเครื่อง 3 หลัก เช่น N100 หรือ B440';
        const data = {
        }

        msgtxt = layoutmsg(data)

        body = JSON.stringify({
            replyToken: reply_token,
            messages: [msgtxt]
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
    let options = {
        method: 'GET',
        url:'https://api.line.me/v2/bot/profile/'+uid,
        headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Bearer GBrEiGkGX0EZnU39JQZPJbCx7ui1c1u3/FvRKp3v0tQWEyEQa4Ob1Bgq+ZbjnZbgNqwyZA38gKPU1XC5DIu4VoprUL1cvFWwLDzfwXzP45n/zHRZ+Mi9JYbNuZetPzJKTctCot2iUDqS8B/2w4ZPJwdB04t89/1O/w1cDnyilFU='
        }
    }       
     return rp(options)
        .then(function(msgBody){
            return  JSON.parse(msgBody).displayName;
        })
        .catch(function (err){
        })
}

function layoutmsg(data){
    return {
        "type": "bubble",
        "size": "giga",
        "direction": "ltr",
        "header": {
            "type": "box",
            "layout": "vertical",
            "contents": [
            {
                "type": "text",
                "text": "กรุณาเลือกเครื่อง",
                "size": "xl",
                "color": "#FFFFFF",
                "weight": "bold",
                "align": "center",
                "style": "normal",
                "wrap": true
            },
            {
                "type": "text",
                "text": "Please Select Machine",
                "size": "lg",
                "align": "center",
                "decoration": "none",
                "weight": "bold",
                "color": "#FFFFFF"
            }
            ],
            "backgroundColor": "#0f55FE"
        },
        "body": {
            "type": "box",
            "layout": "horizontal",
            "contents": [
            {
                "type": "box",
                "layout": "vertical",
                "contents": [
                {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                    {
                        "type": "text",
                        "text": "เครื่องซัก (Washer)",
                        "wrap": false,
                        "align": "center",
                        "color": "#FFFFFF",
                        "weight": "bold"
                    }
                    ],
                    "backgroundColor": "#ff0000",
                    "margin": "none",
                    "borderColor": "#FFFFFF",
                    "spacing": "md"
                },
                {
                    "type": "button",
                    "action": {
                    "type": "uri",
                    "label": "WF-093",
                    "uri": "http://linecorp.com/"
                    },
                    "margin": "sm",
                    "height": "sm",
                    "style": "secondary",
                    "color": "#33DDFF"
                },
                {
                    "type": "button",
                    "action": {
                    "type": "uri",
                    "label": "WF-095",
                    "uri": "http://linecorp.com/"
                    },
                    "margin": "sm",
                    "height": "sm",
                    "style": "secondary",
                    "color": "#33A5FF"
                },
                {
                    "type": "button",
                    "action": {
                    "type": "uri",
                    "label": "WF-097",
                    "uri": "http://linecorp.com/"
                    },
                    "margin": "sm",
                    "height": "sm",
                    "style": "secondary",
                    "color": "#33DDFF"
                },
                {
                    "type": "button",
                    "action": {
                    "type": "uri",
                    "label": "WF-099",
                    "uri": "http://linecorp.com/"
                    },
                    "margin": "sm",
                    "height": "sm",
                    "style": "secondary",
                    "color": "#33A5FF"
                },
                {
                    "type": "button",
                    "action": {
                    "type": "uri",
                    "label": "WF-101",
                    "uri": "http://linecorp.com/"
                    },
                    "margin": "sm",
                    "height": "sm",
                    "style": "secondary",
                    "color": "#33DDFF"
                },
                {
                    "type": "button",
                    "action": {
                    "type": "uri",
                    "label": "WF-103",
                    "uri": "http://linecorp.com/"
                    },
                    "margin": "sm",
                    "height": "sm",
                    "style": "secondary",
                    "color": "#33A5FF"
                }
                ]
            },
            {
                "type": "box",
                "layout": "vertical",
                "contents": [
                {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                    {
                        "type": "text",
                        "text": "เครื่องอบ (Dryer)",
                        "wrap": false,
                        "align": "center",
                        "weight": "bold"
                    }
                    ],
                    "margin": "none",
                    "borderColor": "#0000ff"
                },
                {
                    "type": "button",
                    "action": {
                    "type": "uri",
                    "label": "DF-094",
                    "uri": "http://linecorp.com/"
                    },
                    "margin": "sm",
                    "height": "sm",
                    "style": "secondary",
                    "color": "#33DDFF"
                },
                {
                    "type": "button",
                    "action": {
                    "type": "uri",
                    "label": "DF-096",
                    "uri": "http://linecorp.com/"
                    },
                    "margin": "sm",
                    "height": "sm",
                    "style": "secondary",
                    "color": "#33A5FF"
                },
                {
                    "type": "button",
                    "action": {
                    "type": "uri",
                    "label": "DF-098",
                    "uri": "http://linecorp.com/"
                    },
                    "margin": "sm",
                    "height": "sm",
                    "style": "secondary",
                    "color": "#33DDFF"
                },
                {
                    "type": "button",
                    "action": {
                    "type": "uri",
                    "label": "DF-100",
                    "uri": "http://linecorp.com/"
                    },
                    "margin": "sm",
                    "height": "sm",
                    "style": "secondary",
                    "color": "#33A5FF"
                },
                {
                    "type": "button",
                    "action": {
                    "type": "uri",
                    "label": "DF-102",
                    "uri": "http://linecorp.com/"
                    },
                    "margin": "sm",
                    "height": "sm",
                    "style": "secondary",
                    "color": "#33DDFF"
                },
                {
                    "type": "button",
                    "action": {
                    "type": "uri",
                    "label": "DF-104",
                    "uri": "http://linecorp.com/"
                    },
                    "margin": "sm",
                    "height": "sm",
                    "style": "secondary",
                    "color": "#33A5FF"
                }
                ]
            }
            ],
            "spacing": "sm",
            "margin": "none"
        }
    }
}


