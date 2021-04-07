var express = require('express');
var router = express.Router();
var cors = require("cors");
var model = require('../model/test.model');
const { param } = require('./users');
var fs = require('fs');
var path = require('path');
var multer = require('multer');
const isEmpty = require('lodash.isempty');
var moment = require('moment');
// const testModel = require('../model/test.model');
var axios = require("axios");
var referalcodeSchema = require('../model/referalcodeModel');
var request = require('request-promise');


var userProfile = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, "uploads/users");   
  },
  filename: function (req, file, cb) {
      cb(
          null,
          file.fieldname + "_" + Date.now() + path.extname(file.originalname)
      );
  },
});

var uploadUserProfile = multer({ storage: userProfile });

/* POST Registration (http://localhost:3000/registration) */ 
router.post('/', async function(req, res, next) {

  if(isEmpty(req.body)){
    res.status(404).send("404 ERROR");
  }
  else{
    const mobile = req.body.mobile;
    try{
        var isData = await model.find({ mobile : mobile});
        if(isData.length == 0){
         
          var record = new model({
          name : req.body.name,
          mobile : req.body.mobile,
          email : req.body.email,
          company_name : req.body.company_name,
          referred_by : req.body.referred_by,
          refralcode : req.body.refralcode,
          fcmToken: req.body.fcmToken,
          isVerified: req.body.isVerified,  
          });
          
          record.save();
          
          let userId = record._id;
          console.log(userId);

          let verifiesuser = await model.aggregate([{
            $match : {
              ismember : true
            }
          }]);

          for(i=0; i<verifiesuser.length; i++){
            let newOrderNotification = `A new member ${req.body.name} just registered in our network. `;

            var dataSendToAdmin = {
              "to":verifiesuser[i].fcmToken,
              "priority":"high",
              "content_available":true,
              "data": {
                  "sound": "surprise.mp3",
                  "click_action": "FLUTTER_NOTIFICATION_CLICK"
              },
              "notification":{
                          "body": newOrderNotification,
                          "title":"The National Dawn",
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
          }

          var new_user_refer =  await request.post('http://15.207.46.236/users/getreferalcode',{json :{userid : userId}}, function (error, response, body){
            // console.log(response);
          });
          
          var referused = await referalcodeSchema.find({referalcode : req.body.refralcode});
          
          if(referused.length != 0){
            referalcode = await referalcodeSchema.findByIdAndUpdate(referused[0]._id,{ $push : {usedby : userId} });
            // console.log(referalcode);
          }
          // console.log(record);
          return res.status(200).send({ IsSuccess: true, Message : "Registration Successfull" , Data: [record]});
        }
        else{
          res.status(200).json({ IsSuccess : true, Data : [], Message : "Number Already Registered"});
        }
    }
    catch(err){
      res.status(500).json({ IsSuccess : false, Message : err.message });
    }
  }
});

//add personal Information
router.post("/updatePersonal" , uploadUserProfile.fields([{name:"img"},{name:"companylogo"}]) , async function(req,res,next){
  const { id , name , email , mobile , company_name,ismember ,company_website, referred_by , date_of_birth , gender, 
          address , spouse_name , spouse_birth_date , achievement ,
          number_of_child , memberOf, business_category, experience,keyword, about_business, 
          faceBook , instagram , linkedIn , twitter , whatsApp , youTube
        } = req.body;
        
  // const file = req.file;
  var d = [];
  var e = [];
  var userimg = req.files.img;
  var compicon = req.files.companylogo;
  if(req.files){
    const cloudinary = require('cloudinary').v2;
    cloudinary.config({
      cloud_name: 'dckj2yfap',
      api_key: '693332219167892',
      api_secret: 'acUf4mqnUBJCwsovIz-Ws894NGY'
    });
    
    if(req.files.img){
      var uniqvideo = "";
      uniqvideo = moment().format('MMMM Do YYYY, h:mm:ss a');
      var v = await cloudinary.uploader.upload(userimg[0].path, { public_id: `blog/users/${uniqvideo}`, tags: `blog` },function(err,result) {
      console.log("Error : ", err);
      console.log("Resilt : ", result);
      e[0] = result.url;
      });
    }

    if(req.files.companylogo){
      var uniqvideo = "";
      uniqvideo = moment().format('MMMM Do YYYY, h:mm:ss a');
      var v = await cloudinary.uploader.upload(compicon[0].path, { public_id: `blog/users/${uniqvideo}`, tags: `blog` },function(err,result) {
      console.log("Error : ", err);
      console.log("Resilt : ", result);
      d[0] = result.url;
      });
    }

    // cloudinary.uploader.upload(
    //   path,
    //   { public_id: `blog/users/${uniqueFilename}`, tags: `blog` }, // directory and tags are optional
    //   function(err, image) {
    //     if (err) return res.send(err)
    //     const fs = require('fs');
    //     fs.unlinkSync(path);
    //   }
    // )
  }
  try {
    var update = {
      name : name,
      mobile : mobile,
      email : email,
      company_name : company_name,
      companylogo : req.files == undefined ? "" : d[0],
      ismember : ismember == undefined ? false : ismember,
      referred_by : referred_by,
      date_of_birth: date_of_birth,
      gender: gender,
      address: address,
      spouse_name: spouse_name,
      spouse_birth_date: spouse_birth_date,
      achievement: achievement,
      number_of_child: number_of_child,
      img: req.files == undefined ? "" : e[0],
      memberOf: memberOf,
      business_category: business_category,
      member_id : memberOf,
      business_id : business_category,
      experience: experience,
      about_business: about_business,
      keyword: keyword,
      company_website : company_website,
      faceBook: faceBook,
      instagram: instagram,
      linkedIn: linkedIn,
      twitter: twitter,
      whatsApp: whatsApp,
      youTube: youTube,
    }
    var record = await model.findByIdAndUpdate( id , update );
    let dataPass = await model.find({ _id: id });
    res.status(200).json({ IsSuccess: true , Data: dataPass , Message: "Data Updated" });  
  } catch (error) {
    res.status(500).json({ IsSuccess: false , Message: error.message });
  }
});

// router.post("/sendotp", async function(req, res, next) {
//   const { mobile, code, appSignature } = req.body;
//   try {
//       let message = "Your verification code is " + code + " " + appSignature;
//       let msgportal =
//           "http://promosms.itfuturz.com/vendorsms/pushsms.aspx?user=" +
//           process.env.SMS_USER +
//           "&password=" +
//           process.env.SMS_PASS +
//           "&msisdn=" +
//           mobile +
//           "&sid=" +
//           process.env.SMS_SID +
//           "&msg=" +
//           message +
//           "&fl=0&gwid=2";
//       let getresponse = await axios.get(msgportal);
//       if (getresponse.data.ErrorMessage == "Success") {
//           res
//               .status(200)
//               .json({ Message: "Message Sent!", Data: 1, IsSuccess: true });
//       } else {
//           res
//               .status(200)
//               .json({ Message: "Message Not Sent!", Data: 0, IsSuccess: true });
//       }
//   } catch (err) {
//       res.status(500).json({ Message: err.message, Data: 0, IsSuccess: false });
//   }
// });

router.post("/verify", async function(req, res, next) {
  const { mobile, fcmToken } = req.body;
  try {
      let updateCustomer = await model.findOneAndUpdate({ mobile: mobile }, { isVerified: true, fcmToken: fcmToken });
      if (updateCustomer != null) {
          res
              .status(200)
              .json({ Message: "Verification Complete!", Data: 1, IsSuccess: true });
      } else {
          res
              .status(200)
              .json({ Message: "Verification Failed!", Data: 0, IsSuccess: true });
      }
  } catch (err) {
      res.status(500).json({ Message: err.message, Data: 0, IsSuccess: false });
  }
});

router.get('/registration/:id',async function(req,res){
  var name = req.params.id;
  var query = { name : name };  
 
  var record = await model.find(query);
  console.log(record);
  if(record){
    res.status(200).json({ IsSuccess: true , Data: [record] , Message: "Data Found" });
  }else{
    res.status(200).json({ IsSuccess: false , Data: 0 , Message: "Data not found" });
  }
});

module.exports = router;

//git remote add origin git@github.com:VENDETTA-STACK/blog-vlog.git