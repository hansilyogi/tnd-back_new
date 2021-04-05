var express = require('express');
var router = express.Router();
var networkSchema = require('../model/connectionRequest');
var request = require('request');
var directoryData = require('../model/test.model');
var connectionSchema = require('../model/connectionModel');
const moment = require('moment-timezone');
var referalcodeSchema = require('../model/referalcodeModel');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/networking" , async function(req,res,next){
  const { requestSender , requestReceiver , requestStatus } = req.body;
  try {
    var record = await new networkSchema({
      requestSender: requestSender,
      requestReceiver: requestReceiver,
      requestStatus: requestStatus,
    });
    await record.save();
    var usersData = await networkSchema.find()
                                       .populate({
                                         path: "requestSender",
                                         select: "name"
                                       })
                                       .populate({
                                        path: "requestReceiver",
                                        select: "name"
                                       });
    if(record){
      res.status(200).json({ IsSuccess: true , Data: usersData , Message: "Request Send Successfully" });
    }else{
      res.status(200).json({ IsSuccess: true , Data: 0 , Message: "Request Sending Failed" });
    }
  } catch (error) {
    res.status(500).json({ IsSuccess: false , Message: error.message });
  }
});

router.post("/updateReqStatus" , async function(req,res,next){
  const { requestId , requestStatus } = req.body;
  try {
    var record = await networkSchema.find({ _id: requestId });
    // console.log(record);
    if(record.length == 1){
      let updateIs = await networkSchema.findByIdAndUpdate(requestId,{ requestStatus: requestStatus });
      res.status(200).json({ IsSuccess: true , Data: 1 , Message: "Request Updated" });
    }
  } catch (error) {
    res.status(500).json({ IsSuccess: false , Message: error.message });
  }
});

router.post("/networking_v2" , async function(req,res,next){
  const { requestSender , requestReceiver  } = req.body;
  try {
    var record = await new networkSchema({
      requestSender: requestSender,
      requestReceiver: requestReceiver,
    });
    await record.save();
    // console.log(record);
    var usersData = await networkSchema.find(record)
                                       .populate({
                                         path: "requestSender",
                                         select: "name"
                                       })
                                       .populate({
                                        path: "requestReceiver",
                                        select: "name"
                                       });
    console.log(usersData[0]);

    var sendermobile = await directoryData.find({ name : usersData[0].requestSender.name }).select('mobile -_id');
    // console.log("mobilee......" + sendermobile[0].mobile);

    var receievmobile = await directoryData.find({ name : usersData[0].requestReceiver.name}).select('mobile -_id');

    var sendfcmtoken = await directoryData.find({ mobile : sendermobile[0].mobile}).select('fcmToken -_id');

    var recevefcmtoken = await directoryData.find({ mobile : receievmobile[0].mobile}).select('fcmToken -_id');

    var sender_name = usersData[0].requestSender.name;
    var rece_name = usersData[0].requestReceiver.name;
    var req_id = usersData[0]._id;
    let objDate = new Date();
    let stringDate = objDate.toString();
    let dateList = stringDate.split(" ");
    // console.log("----------------------");
    // console.log("Sender name : " + sender_name);
    // console.log("Receiver name : " + rece_name);
    // console.log("Request ID : " + req_id);

    console.log("................Notification..............................");

    let newOrderNotification = `New Connection Request Received
    Sender name : ${sender_name}
    Receiver name : ${rece_name}
    Request-Id : ${req_id}
    Date-Time : ${dateList}`;

    var dataSendToAdmin = {
      "to":sendfcmtoken[0].fcmToken,
      "priority":"high",
      "content_available":true,
      "data": {
          "sound": "surprise.mp3",
          "click_action": "FLUTTER_NOTIFICATION_CLICK"
      },
      "notification":{
                  "body": newOrderNotification,
                  "title":"New Request Received",
                  "badge":1
              }
    };

    var options2 = {
        'method': 'POST',
        'url': 'https://fcm.googleapis.com/fcm/send',
        'headers': {
            'authorization': 'key=AAAA6iLVZks:APA91bGUpLM6fb7if-uzgCnl4i-xR6734jhkZ3C-u-7PKjFYu0SGsy_cRIDLWGqULXDTt4kR6-etX40Fv2yfrXDDa87V-fY7QsFDIn5lNT-rf3LDpIGmSkmA-Aeffz1OYix-NXMVxabz',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataSendToAdmin)
    };

    request(options2, function (error, response , body) {
      console.log("--------------------Sender--------------------");
      let myJsonBody = JSON.stringify(body);
      //console.log(myJsonBody);
      //myJsonBody[51] USED TO ACCESS RESPONSE DATA SUCCESS FIELD
      console.log(myJsonBody[51]);
      // if(myJsonBody[51]==0){
      //     console.log("Send Text notification of new order..........!!!");
      //     sendMessages(sendermobile[0].mobile,newOrderNotification);
      // }
      if (error) {
          console.log(error.message);
      } else {
          console.log("Sending Notification Testing....!!!");
          console.log("helloo........" + response.body);
          // if(response.body.success=="1"){
          //     console.log("Send Text notification of new order..........!!!");
          //     sendMessages(sendermobile[0].mobile,newOrderNotification);
          // }
      }
    });

    if(record){
      res.status(200).json({ IsSuccess: true , Data: usersData , Message: "Request Send Successfully" });
    }else{
      res.status(200).json({ IsSuccess: true , Data: 0 , Message: "Request Sending Failed" });
    }
  } catch (error) {
    res.status(500).json({ IsSuccess: false , Message: error.message });
  }
});


router.post("/updateReqStatus_v2" , async function(req,res,next){
  const { requestId } = req.body;
  try {
    var record = await networkSchema.find({ _id: requestId });
    console.log(record);
    if(record.length == 1){
      let updateIs = await networkSchema.findByIdAndUpdate(requestId,{ "requestStatus": true });
      res.status(200).json({ IsSuccess: true , Data: 1 , Message: "Request Updated" });
    }
  } catch (error) {
    res.status(500).json({ IsSuccess: false , Message: error.message });
  }
});

router.post("/getUserNotification", async function(req,res,next){
  const id = req.body.id;
  try{
    var notify = await networkSchema.find({ $or: [{requestSender : id}, {requestReceiver : id}] });
    if(notify.length != 0){
      res.status(200).json({IsSuccess : true, Data : notify, Message : "Notification Found"})
    }
    else{
      res.status(200).json({ IsSuccess: true , Data: 0 , Message: "Notification Not Found" });
    }
  }
  catch(err){
    res.status(500).json({ IsSuccess: false , Message: error.message });
  }
});

router.post("/oneTwoOneConnectionReq", async function(req,res,next){
    const { 
        requestSender , 
        requestReceiver , 
        requestStatus, 
        notificationData, 
        meetingType , 
        meetingLink ,
    } = req.body;
    try {
      let objDate = new Date();
      let stringDate = objDate.toString();
      let dateList = stringDate.split(" ");
      let newdate = dateList[2] + " " + dateList[1] + " " + dateList[3];
      console.log(newdate);
      var conn_date = moment()
                      .tz("Asia/Calcutta")
                      .format("DD MM YYYY, h:mm:ss a")
                      .split(",")[0];
      var conn_time = moment()
                      .tz("Asia/Calcutta")
                      .format("DD MM YYYY, h:mm:ss a")
                      .split(",")[1];
      let existRecord = await connectionSchema.find({
          $and: [
            {requestSender : requestSender}, 
            {requestReceiver : requestReceiver},
          ]
        })
        if(existRecord.length == 1){
            res.status(200).json({ IsSuccess: true , Data: existRecord , Message: "Connection Request Already Sent" });
        }else{
          let sendRequest = await new connectionSchema({
            requestSender : requestSender , 
            requestReceiver : requestReceiver, 
            requestStatus : requestStatus, 
            notification : notificationData, 
            meetingType : meetingType, 
            meetingLink : meetingLink,
            date: conn_date,
            time: conn_time,
          })
      
          if(sendRequest != null){
            sendRequest.save();
            let receiverData = await directoryData.find({ _id: requestReceiver })
                                                  .select("fcmToken name mobile email");
            
            console.log(receiverData[0].fcmToken);
            let notificationTitleIs = notificationData.notificationTitle;
            let notificationBodyIs = notificationData.notificationBody;
            console.log(notificationTitleIs);
            console.log(notificationBodyIs);
            let receiverFcmToken = receiverData[0].fcmToken;
            var sendReqNotiToReceiver = {
              "to":receiverFcmToken,
              "priority":"high",
              "content_available":true,
              "data": {
                  "sound": "surprise.mp3",
                  "click_action": "FLUTTER_NOTIFICATION_CLICK",
                  "senerID" : requestSender,
                  "ReceiverId" : requestReceiver,
                  "status" : requestStatus,
              },
              "notification":{
                          "body": notificationBodyIs,
                          "title":notificationTitleIs,
                          "date" : newdate,
                          "badge":1
                      }
            };
        
            var options2 = {
                'method': 'POST',
                'url': 'https://fcm.googleapis.com/fcm/send',
                'headers': {
                    'authorization': 'key=AAAA6iLVZks:APA91bGUpLM6fb7if-uzgCnl4i-xR6734jhkZ3C-u-7PKjFYu0SGsy_cRIDLWGqULXDTt4kR6-etX40Fv2yfrXDDa87V-fY7QsFDIn5lNT-rf3LDpIGmSkmA-Aeffz1OYix-NXMVxabz',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sendReqNotiToReceiver)
            };
        
            request(options2, function (error, response , body) {
              console.log("--------------------Sender--------------------");
              let myJsonBody = JSON.stringify(body);
              //console.log(myJsonBody);
              //myJsonBody[51] USED TO ACCESS RESPONSE DATA SUCCESS FIELD
              // console.log(myJsonBody);
              // if(myJsonBody[51]==0){
              //     console.log("Send Text notification of new order..........!!!");
              //     sendMessages(sendermobile[0].mobile,newOrderNotification);
              // }
              if (error) {
                  console.log(error.message);
              } else {
                  console.log("Sending Notification Testing....!!!");
                  console.log("helloo........" + response.body);
                  // if(response.body.success=="1"){
                  //     console.log("Send Text notification of new order..........!!!");
                  //     sendMessages(sendermobile[0].mobile,newOrderNotification);
                  // }
              }
            });
            res.status(200).json({ IsSuccess: true , Data: 1 , Message: "Connection Requested" });
          }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "Connection Not Send" });
          }
        }
        
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/oneTwoOneConnectionReq_v1", async function(req,res,next){
  const { 
      requestSender , 
      requestReceiver , 
      requestStatus,
      notificationData,
      meetingType , 
      meetingLink ,
  } = req.body;
  try {
    let objDate = new Date();
    let stringDate = objDate.toString();
    let dateList = stringDate.split(" ");
    let newdate = dateList[2] + " " + dateList[1] + " " + dateList[3];
    console.log(newdate);
    var conn_date = moment()
                    .tz("Asia/Calcutta")
                    .format("DD MM YYYY, h:mm:ss a")
                    .split(",")[0];
    var conn_time = moment()
                    .tz("Asia/Calcutta")
                    .format("DD MM YYYY, h:mm:ss a")
                    .split(",")[1];
    let existRecord = await connectionSchema.find({
        $and: [
          {requestSender : requestSender},
          {requestReceiver : requestReceiver},
        ]
      });
      console.log(existRecord);
      if(existRecord.length == 1){
        console.log(1);
          if(existRecord[0].requestStatus == 'rejected' || existRecord[0].requestStatus == 'send'){
            var againreq = await connectionSchema.findByIdAndUpdate(existRecord[0]._id, {requestStatus : 'requested'});
            
            let receiverData = await directoryData.find({ _id: requestReceiver })
                                                .select("fcmToken name mobile email");
            console.log(receiverData[0].fcmToken);
            let notificationTitleIs = notificationData.notificationTitle;
            let notificationBodyIs = notificationData.notificationBody;
            console.log(notificationTitleIs);
            console.log(notificationBodyIs);
            let receiverFcmToken = receiverData[0].fcmToken;
            var sendReqNotiToReceiver = {
              "to":receiverFcmToken,
              "priority":"high",
              "content_available":true,
              "data": {
                  "sound": "surprise.mp3",
                  "click_action": "FLUTTER_NOTIFICATION_CLICK",
                  "senerID" : requestSender,
                  "ReceiverId" : requestReceiver,
                  "status" : requestStatus,
              },
              "notification":{
                          "body": notificationBodyIs,
                          "title":notificationTitleIs,
                          "date" : newdate,
                          "badge":1
                      }
            };
        
            var options2 = {
                'method': 'POST',
                'url': 'https://fcm.googleapis.com/fcm/send',
                'headers': {
                    'authorization': 'key=AAAA6iLVZks:APA91bGUpLM6fb7if-uzgCnl4i-xR6734jhkZ3C-u-7PKjFYu0SGsy_cRIDLWGqULXDTt4kR6-etX40Fv2yfrXDDa87V-fY7QsFDIn5lNT-rf3LDpIGmSkmA-Aeffz1OYix-NXMVxabz',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sendReqNotiToReceiver)
            };
        
            request(options2, function (error, response , body) {
              console.log("--------------------Sender--------------------");
              let myJsonBody = JSON.stringify(body);
              //console.log(myJsonBody);
              //myJsonBody[51] USED TO ACCESS RESPONSE DATA SUCCESS FIELD
              // console.log(myJsonBody);
              // if(myJsonBody[51]==0){
              //     console.log("Send Text notification of new order..........!!!");
              //     sendMessages(sendermobile[0].mobile,newOrderNotification);
              // }
              if (error) {
                  console.log(error.message);
              } else {
                  console.log("Sending Notification Testing....!!!");
                  console.log("helloo........" + response.body);
                  // if(response.body.success=="1"){
                  //     console.log("Send Text notification of new order..........!!!");
                  //     sendMessages(sendermobile[0].mobile,newOrderNotification);
                  // }
              }
            });

            var news_wp =  await request.post('http://15.207.46.236/directory/directorylisting',{json:{userid : requestSender}}, function (error, response, body){
            });

            res.status(200).json({ IsSuccess: true , Data: existRecord , Message: "Connection Request Sent Again" });
          }
      }else{
        console.log(2);
        let sendRequest = await new connectionSchema({
          requestSender : requestSender , 
          requestReceiver : requestReceiver, 
          requestStatus : requestStatus,
          notification : notificationData, 
          meetingType : meetingType, 
          meetingLink : meetingLink,
          date: conn_date,
          time: conn_time,
        })
    
        if(sendRequest != null){
          sendRequest.save();
          let receiverData = await directoryData.find({ _id: requestReceiver })
                                                  .select("fcmToken name mobile email");
            
            console.log(receiverData[0].fcmToken);
            let notificationTitleIs = notificationData.notificationTitle;
            let notificationBodyIs = notificationData.notificationBody;
            console.log(notificationTitleIs);
            console.log(notificationBodyIs);
            let receiverFcmToken = receiverData[0].fcmToken;
            var sendReqNotiToReceiver = {
              "to":receiverFcmToken,
              "priority":"high",
              "content_available":true,
              "data": {
                  "sound": "surprise.mp3",
                  "click_action": "FLUTTER_NOTIFICATION_CLICK",
                  "senerID" : requestSender,
                  "ReceiverId" : requestReceiver,
                  "status" : requestStatus,
              },
              "notification":{
                          "body": notificationBodyIs,
                          "title":notificationTitleIs,
                          "date" : newdate,
                          "badge":1
                      }
            };
        
            var options2 = {
                'method': 'POST',
                'url': 'https://fcm.googleapis.com/fcm/send',
                'headers': {
                    'authorization': 'key=AAAA6iLVZks:APA91bGUpLM6fb7if-uzgCnl4i-xR6734jhkZ3C-u-7PKjFYu0SGsy_cRIDLWGqULXDTt4kR6-etX40Fv2yfrXDDa87V-fY7QsFDIn5lNT-rf3LDpIGmSkmA-Aeffz1OYix-NXMVxabz',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sendReqNotiToReceiver)
            };
        
            request(options2, function (error, response , body) {
              console.log("--------------------Sender--------------------");
              let myJsonBody = JSON.stringify(body);
              //console.log(myJsonBody);
              //myJsonBody[51] USED TO ACCESS RESPONSE DATA SUCCESS FIELD
              // console.log(myJsonBody);
              // if(myJsonBody[51]==0){
              //     console.log("Send Text notification of new order..........!!!");
              //     sendMessages(sendermobile[0].mobile,newOrderNotification);
              // }
              if (error) {
                  console.log(error.message);
              } else {
                  console.log("Sending Notification Testing....!!!");
                  console.log("helloo........" + response.body);
                  // if(response.body.success=="1"){
                  //     console.log("Send Text notification of new order..........!!!");
                  //     sendMessages(sendermobile[0].mobile,newOrderNotification);
                  // }
              }
            });

            var news_wp =  await request.post('http://15.207.46.236/directory/directorylisting',{json:{userid : requestSender}}, function (error, response, body){
            });
          
          res.status(200).json({ IsSuccess: true , Data: 1 , Message: "Connection Requested" });
        }else{
          res.status(200).json({ IsSuccess: true , Data: 0 , Message: "Connection Not Send" });
        }
      }
  } catch (error) {
      res.status(500).json({ IsSuccess: false , Message: error.message });
  }
});

router.post("/updateConnectionReq", async function(req,res,next){
    const {
        requestSender , 
        requestReceiver , 
        requestStatus,
    } = req.body;
    console.log("Req Body : "+req.body);
    console.log("------------------------------------------------");
    try {
        let existRecord = await connectionSchema.find({
          $and: [
            {requestSender : requestSender} , 
            {requestReceiver : requestReceiver} ,
          ]
        })
        .populate({
          path : "requestSender",
          select : "name mobile email"
        })
        .populate({
          path : "requestReceiver",
          select : "name mobile email"
        });
        // console.log("response ---------------- "+existRecord);
        if(existRecord.length == 1){
          let updateIs = {
            requestStatus: requestStatus
          }
          console.log("update : " + updateIs);
          console.log("------------------------------------------------");
          let updateConnection = await connectionSchema.findByIdAndUpdate(existRecord[0]._id,updateIs);
          let receiverData = await directoryData.find({ _id: requestReceiver })
                                                  .select("fcmToken name mobile email");
                                                
          let senderData = await directoryData.find({ _id: requestSender })
          .select("fcmToken name mobile email");
  
            console.log(receiverData[0].fcmToken);
            let notificationTitleIs = "Request Updated";
            let notificationBodyIs = existRecord[0].requestReceiver.name + " has " + requestStatus +  " your Request";
            console.log(notificationTitleIs);
            console.log(notificationBodyIs);
            let receiverFcmToken = receiverData[0].fcmToken;
            let senderFcmToken = senderData[0].fcmToken;
            var sendReqNotiToReceiver = {
              "to":senderFcmToken,
              "priority":"high",
              "content_available":true,
              "data": {
                  "sound": "surprise.mp3",
                  "click_action": "FLUTTER_NOTIFICATION_CLICK",
                  "senerID" : requestSender,
                  "ReceiverId" : requestReceiver,
                  "status" : requestStatus,
              },
              "notification":{
                          "body": notificationBodyIs,
                          "title":notificationTitleIs,
                          "badge":1
                      }
            };
        
            var options2 = {
                'method': 'POST',
                'url': 'https://fcm.googleapis.com/fcm/send',
                'headers': {
                    'authorization': 'key=AAAA6iLVZks:APA91bGUpLM6fb7if-uzgCnl4i-xR6734jhkZ3C-u-7PKjFYu0SGsy_cRIDLWGqULXDTt4kR6-etX40Fv2yfrXDDa87V-fY7QsFDIn5lNT-rf3LDpIGmSkmA-Aeffz1OYix-NXMVxabz',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sendReqNotiToReceiver)
            };
        
            request(options2, function (error, response , body) {
              console.log("--------------------Sender--------------------");
              let myJsonBody = JSON.stringify(body);
              //console.log(myJsonBody);
              //myJsonBody[51] USED TO ACCESS RESPONSE DATA SUCCESS FIELD
              // console.log(myJsonBody);
              // if(myJsonBody[51]==0){
              //     console.log("Send Text notification of new order..........!!!");
              //     sendMessages(sendermobile[0].mobile,newOrderNotification);
              // }
              if (error) {
                  console.log(error.message);
              } else {
                  console.log("Sending Notification Testing....!!!");
                  console.log("helloo........" + response.body);
                  // if(response.body.success=="1"){
                  //     console.log("Send Text notification of new order..........!!!");
                  //     sendMessages(sendermobile[0].mobile,newOrderNotification);
                  // }
              }
            });

            var news_wp =  await request.post('http://15.207.46.236/directory/directorylisting',{json:{userid : requestSender}}, function (error, response, body){
            });

          res.status(200).json({ IsSuccess: true , Data: 1 , Message: "Connection Updated" });
        }else{
          res.status(200).json({ IsSuccess: true , Data: 0 , Message: "No Connection Data Exist" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/getsingleusernotification", async function(req,res,next){
  const id = req.body.id;
  try{
    var data = await connectionSchema.find({ requestReceiver : id});
    if(data.length == 0){
      res.status(200).json({ IsSuccess : true, Data : [], Message : "No user Found"});
    }
    else{
      // console.log(news_id);
      res.status(200).json({ IsSuccess : true,Count: data.length, Data : data, Message : "User Found"});
    }
  }
  catch(err){
    res.status(500).json({ IsSuccess: false , Message: err.message });
  }
});

router.post("/requestcomplete", async function(req,res,next){
  // const id = req.body.connectionid;
  const {topic,date,requestSender , requestReceiver , generatedRefral} = req.body;
  try{
    var dataexist = await connectionSchema.find({ $and: [{requestSender : requestSender}, {requestReceiver : requestReceiver} , {requestStatus : "accepted"}] });
    if(dataexist.length == 0){
      res.status(200).json({IsSuccess : true, Data : 0, Message : "Status is Still Pending to Accpet"});
    }
    else{
      var isstatus = {
        topic : topic,
        generatedRefral : generatedRefral,
        date : date,
        requestStatus : "send"
      };

      var updateid = await connectionSchema.findByIdAndUpdate(dataexist[0]._id, isstatus);
      // console.log(updateid);
      var news_wp =  await request.post('http://15.207.46.236/directory/directorylisting',{json:{userid : requestSender}}, function (error, response, body){
            });

      res.status(200).json({ IsSuccess : true, Data : 1, Message : "Data updated"});
    }
  }
  catch(err){
    res.status(500).json({ IsSuccess: false , Message: err.message });
  }
});

function getRandomString(length) {
  var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var result = '';
  for ( var i = 0; i < length; i++ ) {
      result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
  }
  return result;
}

router.post("/getreferalcode", async function(req,res,next){
  const userid = req.body.userid;
  // console.log("userid : " + userid);
  try{
    var data = await referalcodeSchema.find({Userid : userid});
    if(data.length != 0){
      res.status(200).json({IsSuccess : true, Data : 0, Message : "User already has referal code"});
    }
    else{
      var new_refer = getRandomString(6);
      var newdata = await new referalcodeSchema({
        Userid : userid,
        referalcode : new_refer,
      });
      newdata.save();
      res.status(200).json({IsSuccess : true, Data : 1, Message : "User got Referal Code"});
    }
  }
  catch(err){
    res.status(500).json({ IsSuccess: false , Message: err.message });
  }
});

router.post("/getsingleuser_refer" ,async function(req,res,next){
  const userid = req.body.userid;
  try{
    var referdata = await referalcodeSchema.find({Userid : userid});
    if(referdata.length == 0){
      res.status(200).json({IsSuccess : true, Data : 0, Message : "No Data Found"});
    }
    else{
      res.status(200).json({IsSuccess : true, Data : referdata, Message : "Data Found"});
    }
  }
  catch(err){
    res.status(500).json({ IsSuccess: false , Message: err.message });
  }
});

module.exports = router;