const functions = require("firebase-functions");
const request = require("request-promise");
const config = require("./config.json");
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const {WebhookClient, Payload} = require("dialogflow-fulfillment");


const region = "asia-east2";
const runtimeOptions = {
    timeoutSeconds:4,
    memory:"2GB"
};

exports.webhook = functions
    .region(region)
    .runWith(runtimeOptions)
    .https.onRequest(async (req, res) => {
        console.log("LINE REQUEST BODY", JSON.stringify(req.body));

        const agent = new WebhookClient({request:req , response:res});

        
        const loginView = async agent=>{

            const flexMenuMsg = {};

            const payloadMsg = new Payload("LINE",flexMenuMsg,{sendAsMessage:true});
            // agent.add("this is from fulfillment");
            return agent.add(payloadMsg);
        };
        
        let intentMap = new Map();
        intentMap.set("login-view",loginView);
        agent.handleRequest(intentMap);


        // const replyToken = req.body.events[0].replyToken;
        // const messages = [{
        //     "type":"text",
        //     "text":req.body.events[0].message.text
        // }];
        // return lineReply(replyToken, messages);
    });

const lineReply = (replyToken, messages) => {
    const body = {
        replyToken: replyToken,
        messages: messages
    };
    return request({
        method: "POST",
        url: `${config.lineMessagingApi}/reply`,
        headers: config.lineHeaders,
        body: JSON.stringify(body)
    });
};