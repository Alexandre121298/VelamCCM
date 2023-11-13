
const express = require('express')
const app = express()
const webpush = require('web-push')
const vapidKeys = require('../vapidkeys')
app.use(express.urlencoded({extended: true}));

webpush.setVapidDetails(
    'mailto:blabla@bla.fr',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)

app.use(express.json());

let endPoints = [];

app.get('/', function(req, res){
    res.send('Push App!');
});

app.post('/send', (req, res) => {
    const title = req.body.title;
    const message = req.body.message;

    console.log(req.body);

    webpush.sendNotification(endPoints[0], JSON.stringify({ 
        title: title, 
        body: message
    })).then((detail_req) => {
        console.log("send");
        res.send(JSON.stringify( {"success" : "true"}));
    })
    .catch((reason) => {
        res.send(JSON.stringify( {"success" : "false"}));
    })
})

app.listen(80, function(){
    console.log('Push server start');
});

app.post('/api/save-subscription', function (req, res){

    endPoints.push(req.body);

    //console.log(req);

    res.setHeader('Content-Type', 'application/json');

    res.send(JSON.stringify( {"status" : "success"}));

    console.log(res.statusCode);
    console.log(endPoints[0])
})

app.use(express.static('..'))