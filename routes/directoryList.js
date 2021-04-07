var express = require('express');
var router = express.Router();

var connectionRequestSchema = require('../model/connectionRequest');
var directoryData = require('../model/test.model');
var connectionModel = require('../model/connectionModel');
var inquirySchema = require('../model/inquiryModel');
const mongoose  = require('mongoose');

// router.post('/directorylisting', async function(req , res , next){
//     const userid = req.body.userid;
//     try {
//         let directoryList = await directoryData.find({ $and : [ {ismember : true}, {_id : { $ne : userid }} ] })
//                                                .populate({
//                                                    path: "business_category",
//                                                })
//                                                .populate({
//                                                    path: "memberOf"
//                                                });
        
//         let conndata = await connectionModel.find({requestSender : userid});
        
//         for(let y = 0; y < conndata.length; y++){
//             // console.log("Recevieer Id : "+ conndata[y].requestReceiver);
//             var finddata = await directoryData.find({_id : conndata[y].requestReceiver});
//             if(finddata != null){
//                 let statusdata = await directoryData
//                         .findByIdAndUpdate(finddata[0]._id, {status : conndata[y].requestStatus});
//             }
//             // console.log("update id : "+finddata[0]._id);
//         }
        
//         if(directoryList != null){
//             res.status(200).json({ Message: "Data Found...!!!", Count : directoryList.length , Data: directoryList, IsSuccess: true });
//         }else{
//             res.status(200).json({ Message: "Data Not Found...!!!", IsSuccess: false });
//         }
//     } catch (error) {
//         res.status(500).json({ Message: error.message, IsSuccess: false });
//     }
// });

router.post('/directorylisting', async function(req , res , next){
    const userid = req.body.userid;
    try {
        // let directoryList = await directoryData.find({ $and : [{ _id : {$ne : userid} }] })
        //                                        .populate({
        //                                            path: "business_category",
        //                                        })
        //                                        .populate({
        //                                            path: "memberOf"
        //                                        });
        let directoryList = await directoryData.aggregate([
            {
                $match: ({ $and : [{_id : {$ne : mongoose.Types.ObjectId(userid)}}, {ismember : true}] })
            },
            {
                $lookup:
                        {
                            from: "inquiries",
                            localField: "_id",
                            foreignField: "toUser",
                            as: "inquireData"
                        }
            },
            {
                $lookup:
                        {
                            from: "businesscategories",
                            localField: "business_category",
                            foreignField: "_id",
                            as: "businessCategory"
                        }
            },
            {
                $lookup:
                        {
                            from: "memberships",
                            localField: "memberOf",
                            foreignField: "_id",
                            as: "MemeberCategory"
                        }
            }
        ]);
        
        let conndata = await connectionModel.find({requestSender : userid});
        
        for(let y = 0; y < conndata.length; y++){
            var finddata = await directoryData.find({_id : conndata[y].requestReceiver});
            if(finddata != null){
                let statusdata = await directoryData
                        .findByIdAndUpdate(finddata[0]._id, {status : conndata[y].requestStatus});
            }
        }
        
        if(directoryList != null){
            res.status(200).json({ Message: "Data Found...!!!", Count : directoryList.length , Data: directoryList, IsSuccess: true });
        }else{
            res.status(200).json({ Message: "Data Not Found...!!!", IsSuccess: false });
        }
    } catch (error) {
        res.status(500).json({ Message: error.message, IsSuccess: false });
    }
});

router.post("/updateStatus",async function(req,res,next){
    try {
        let user = await directoryData.find();
        for(let i=0;i<user.length;i++){
            let updateIs = await directoryData.findByIdAndUpdate(user[i]._id,{ count: 0 });
        }
        res.send("Chokhkhi.................>>>!!!!!!!!!!!!!!!!!!!!!");
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post('/directorylistingV2', async function(req , res , next){
    try {
        let directoryList = await directoryData.find()
                                               .populate({
                                                   path: "business_category",
                                               })
                                               .populate({
                                                   path: "memberOf"
                                               });
        if(directoryList != null){
            res.status(200).json({ Message: "Data Found...!!!", Count : directoryList.length , Data: directoryList, IsSuccess: true });
        }else{
            res.status(200).json({ Message: "Data Not Found...!!!", IsSuccess: false });
        }
    } catch (error) {
        res.status(500).json({ Message: error.message, IsSuccess: false });
    }
});

router.post("/getuserbycategoryid", async function(req,res,next){
    const cid = req.body.id;
    try{
        let directoryListv2 = await directoryData.find({business_category : cid})
                                               .populate({
                                                   path: "business_category",
                                               })
                                               .populate({
                                                   path: "memberOf"
                                               });
        if(directoryListv2 != null){
            res.status(200).json({ Message: "Data Found...!!!", Count : directoryListv2.length , Data: directoryListv2, IsSuccess: true });
        }else{
            res.status(200).json({ Message: "Data Not Found...!!!", IsSuccess: false });
        }
    }
    catch(err){
        res.status(500).json({ Message: error.message, IsSuccess: false });
    }
});

router.post('/profile', async function(req , res , next){
    const { id } = req.body;
    try {
        let directoryList = await directoryData.find({ _id: id });
        if(directoryList != null){
            res.status(200).json({ Message: "Data Found...!!!", Count : directoryList.length , Data: directoryList, IsSuccess: true });
        }else{
            res.status(200).json({ Message: "Data Not Found...!!!", IsSuccess: false });
        }
    } catch (error) {
        res.status(500).json({ Message: error.message, IsSuccess: false });
    }
});

router.post("/directoryconnection", async function(req,res,next){
    const userid = req.body.userid;
    try{
        var userdata = await directoryData.find({_id : userid});
        var conndata = await connectionModel.find({requestSender : userid})
                                            .select('requestReceiver requestStatus');
        
        var result = userdata + conndata;
        res.status(200).json({ IsSuccess : true, Data : conndata, Message : "Data found"});
    }
    catch(err){
        res.status(500).json({ Message: error.message, IsSuccess: false });
    }
});

module.exports = router;