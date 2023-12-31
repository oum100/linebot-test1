// Reply with two static messages

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const rp = require('request-promise');
const app = express();
const port = process.env.PORT || 4000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.post('/webhook', async (req, res) => {
    //console.log(req.body);
    //console.log();
    console.log("Start body.\n");
    console.log(req.body.events);
    console.log("End body.\n");

    let reply_token = req.body.events[0].replyToken;
    let timestamp = req.body.events[0].source.timestamp;
    let menu_msg = req.body.events[0].message.text;
    let uid = req.body.events[0].source.userId;
    let uname=await getdispname(uid);

    console.log('Timestamp: '+timestamp+'\n');
    console.log('message:'+menu_msg+'\n');
    console.log('UserId: '+uid+'\n');
    console.log('User Name: '+uname+'\n');

    // uname = await getdispname(uid).then(function(uname){
    //     console.log('getdisplayname: '+ uname+'\n');
    //     //reply(reply_token,menu_msg,uname);
    // });

    reply(reply_token,menu_msg,uname);

    res.sendStatus(200);
});

app.listen(port);

// const machines = [
//   "WF-0093","DF-0094",
//   "WF-0095","DF-0094",
//   "WF-0097","DF-0094",
//   "WF-0099","DF-0100",
//   "WF-0101","DF-0102",
//   "WF-0103","DF-0104"
// ];


//Function all.
function reply(reply_token,menu,uname) {
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer GBrEiGkGX0EZnU39JQZPJbCx7ui1c1u3/FvRKp3v0tQWEyEQa4Ob1Bgq+ZbjnZbgNqwyZA38gKPU1XC5DIu4VoprUL1cvFWwLDzfwXzP45n/zHRZ+Mi9JYbNuZetPzJKTctCot2iUDqS8B/2w4ZPJwdB04t89/1O/w1cDnyilFU='
    };
    let body="";
    let msgtxt = "";
    let assetid = menu.substr(1);

    switch (true){
        case menu[0] == "N" || menu[0]== "n":
            //console.log('print N');
            //msgtxt = 'ตั้งแจ้งเตือนเครื่อง '+ assetid + ' ให้คุณ \"' + uname + '\" เรียบร้อย';
            msgtxt = machinelist("Notification");
            break;
        case menu[0] == "O" || menu[0]== "o":   
            //console.log('print B');
            //msgtxt = 'ใช้บริการ '+ assetid + ' ให้คุณ \"' + uname + '\" เรียบร้อย';
            msgtxt = machinelist("Wash & Dry");
            break;
        case menu[0] == "Q" || menu[0]== "q":   
            //console.log('print B');
            //msgtxt = 'จองคิวเครื่อง '+ assetid + ' ให้คุณ \"' + uname + '\" เรียบร้อย';
            msgtxt = machinelist("Booking");
            break;
        default:
            //msgtxt = 'ไม่พบคำสั่ง กรุณาใส่คำสั่ง (N=แจ้งเตือน,B=จองคิว) และตามด้วยหมายเลขเครื่อง 3 หลัก เช่น N100 หรือ B440';
            msgtxt = quickReply();
    }
    // body = JSON.stringify({
    //     replyToken: reply_token,
    //     messages: [{
    //         type: 'text',
    //         text: msgtxt
    //     }]
    // })

    body = JSON.stringify({
        replyToken: reply_token,
        messages: [msgtxt]
        // messages: [{
        //   "type":"text",
        //   "text":`"Hello" ${msgtxt}`
        // }]
    });

    console.log('Start Reply body \n');
    console.log(body+'\n');
    console.log('End Reply body \n');

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
    };
     return rp(options)
        .then(function(msgBody){
            return  JSON.parse(msgBody).displayName;
        })
        .catch(function (err){
        });
}




function machinelist(header){
return {
    "type": "flex",
    "altText": "I-Am-Teemo Flex Message",
    "contents": {
      "type": "bubble",
      "size": "mega",
      "direction": "ltr",
      "header": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": "กรุณาเลือกเครื่องสำหรับ",
            "size": "xl",
            "color": "#FFFFFF",
            "weight": "bold",
            "align": "center",
            "style": "normal",
            "wrap": true
          },
          {
            "type": "text",
            "text": header,
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
                    "text": "ซักผ้า(Washer)",
                    "wrap": false,
                    "align": "center",
                    "weight": "bold"
                  }
                ],
                "margin": "none"
              },
              {
                "type": "button",
                "action": {
                  "type": "message",
                  "label": "WF-093",
                  "text": `"(${header})WF-0093"`
                },
                "margin": "sm",
                "height": "sm",
                "style": "secondary",
                "color": "#33DDFF"
              },
              {
                "type": "button",
                "action": {
                  "type": "message",
                  "label": "WF-095",
                  "text": "WF-0095"
                },
                "margin": "sm",
                "height": "sm",
                "style": "secondary",
                "color": "#33A5FF"
              },
              {
                "type": "button",
                "action": {
                  "type": "message",
                  "label": "WF-097",
                  "text": "WF-0097"
                },
                "margin": "sm",
                "height": "sm",
                "style": "secondary",
                "color": "#33DDFF"
              },
              {
                "type": "button",
                "action": {
                  "type": "message",
                  "label": "WF-099",
                  "text": "WF-0099"
                },
                "margin": "sm",
                "height": "sm",
                "style": "secondary",
                "color": "#33A5FF"
              },
              {
                "type": "button",
                "action": {
                  "type": "message",
                  "label": "WF-101",
                  "text": "WF-0101"
                },
                "margin": "sm",
                "height": "sm",
                "style": "secondary",
                "color": "#33DDFF"
              },
              {
                "type": "button",
                "action": {
                  "type": "message",
                  "label": "WF-103",
                  "text": "WF-0103"
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
                    "text": "อบผ้า (Dryer)",
                    "wrap": false,
                    "align": "center",
                    "weight": "bold"
                  }
                ],
                "margin": "none"
              },
              {
                "type": "button",
                "action": {
                  "type": "message",
                  "label": "DF-094",
                  "text": "DF-0094"
                },
                "margin": "sm",
                "height": "sm",
                "style": "secondary",
                "color": "#33DDFF"
              },
              {
                "type": "button",
                "action": {
                  "type": "message",
                  "label": "DF-096",
                  "text": "DF-0096"
                },
                "margin": "sm",
                "height": "sm",
                "style": "secondary",
                "color": "#33A5FF"
              },
              {
                "type": "button",
                "action": {
                  "type": "message",
                  "label": "DF-098",
                  "text": "DF-0098"
                },
                "margin": "sm",
                "height": "sm",
                "style": "secondary",
                "color": "#33DDFF"
              },
              {
                "type": "button",
                "action": {
                  "type": "message",
                  "label": "DF-100",
                  "text": "DF-0100"
                },
                "margin": "sm",
                "height": "sm",
                "style": "secondary",
                "color": "#33A5FF"
              },
              {
                "type": "button",
                "action": {
                  "type": "message",
                  "label": "DF-102",
                  "text": "DF-0102"
                },
                "margin": "sm",
                "height": "sm",
                "style": "secondary",
                "color": "#33DDFF"
              },
              {
                "type": "button",
                "action": {
                  "type": "message",
                  "label": "DF-104",
                  "text": "DF-0104"
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
  };
}


function quickReply() {
    return {
        "type": "text",
        "text": "Please send me your location!, I will report AQI for you.",
        "quickReply": {
            "items": [{
                "type": "action",
                "action": {
                "type": "location",
                "label": "Send Location"
                }
            }]
        }
     };
}
