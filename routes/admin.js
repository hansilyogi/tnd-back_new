var express = require('express');
const app = require('../app.js');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
const path = require('path');
var request = require('request-promise');
// var moment = require('moment');
const moment = require('moment-timezone');
const mongoose = require("mongoose");
// var request = require('request');

const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'dckj2yfap',
    api_key: '693332219167892',
    api_secret: 'acUf4mqnUBJCwsovIz-Ws894NGY'
});

var newsCategorySchema = require('../model/newsCategory.js');
var bannerSchema = require('../model/bannerModel');
var offerSchema = require('../model/offerModel');
var newsModelSchema = require('../model/newsModel');
var successStorySchema = require('../model/successStoryModel');
var eventSchema = require('../model/eventModel');
const bannerModel = require('../model/bannerModel');
var directoryData = require('../model/test.model');
var businessCategorySchema = require('../model/businessCategoryModel');
var bookMarkSchema = require("../model/userBookMarkNews");
var memberModelSchema = require("../model/memberModel");
var eventregSchema = require("../model/eventregisterModel");
var inquirySchema = require("../model/inquiryModel");
var business_storiesCategorySchema = require('../model/business_stories_categoryModel');
var bussModelSchema = require('../model/bus_storyModel');
const { off, resource, all } = require('../app.js');
const { time } = require('console');

var newCategoryImage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/newsCategoryPic");   
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "_" + Date.now() + path.extname(file.originalname)
        );
    },
});

var newsImage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/newsPictures");   
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "_" + Date.now() + path.extname(file.originalname)
        );
    },
});

var bannerlocation = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/banners");
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "_" + Date.now() + path.extname(file.originalname)
        );
    },
});

var offerBannerlocation = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/offer");
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "_" + Date.now() + path.extname(file.originalname)
        );
    },
});

var successStorylocation = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/successStory");
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "_" + Date.now() + path.extname(file.originalname)
        );
    },
});

var eventlocation = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/eventsPic");
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "_" + Date.now() + path.extname(file.originalname)
        );
    },
});

var businessCategorylocation = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/businessCategory");
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "_" + Date.now() + path.extname(file.originalname)
        );
    },
});

var memberShiplocation = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/memberShip");
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "_" + Date.now() + path.extname(file.originalname)
        );
    },
});

var uploadCategoryImg = multer({ storage: newCategoryImage });
var uploadNewsImg = multer({ storage: newsImage });
var uploadbanner = multer({ storage: bannerlocation });
var uploadOfferbanner = multer({ storage: offerBannerlocation });
var uploadSuccessStory = multer({ storage: successStorylocation });
var uploadEvent = multer({ storage: eventlocation });
var uploadBusinessCategory = multer({ storage: businessCategorylocation });
var uploadMemberShip = multer({ storage: memberShiplocation });

router.post('/adminlogin',async function(req,res,next){
    const { username , password } = req.body;

    try {
        if( req.body.username=="admin003" && req.body.password == "admin" ){
            res.status(200).json({ IsSuccess : true , Data: 1 , Message : "Admin LoggedIn...!!!" });
        }else{
            res.status(200).json({ IsSuccess : false , Message : "Credential Mismatched...!!!" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess : false , Message : "Something Wrong...!!!" });
    }
});

router.post('/multiphoto', uploadNewsImg.array('newsImage'), async function(req,res,next){
    var fileinfo = req.files;
    var d =[];
    const cloudinary = require('cloudinary').v2;
        cloudinary.config({
          cloud_name: 'dckj2yfap',
          api_key: '693332219167892',
          api_secret: 'acUf4mqnUBJCwsovIz-Ws894NGY'
        });
    for(var j =0; j < fileinfo.length; j++){
        var uniqname = "";
        uniqname = moment().format('MMMM Do YYYY, h:mm:ss a');
        var c = await cloudinary.uploader.upload(fileinfo[j].path,{ public_id: `blog/newsPictures/${uniqname}`, tags: `blog` },function(err,result) {
            console.log("Error : ", err);
            console.log("Resilt : ", result);
            d[j] = result.url;
        });
    }
    // console.log("------------------------------------------------");
    // console.log(d);
    res.send(fileinfo);
});

router.post("/addNewsCategory" , uploadCategoryImg.single("categoryImage") , async function(req,res,next){
    const { newsType , newsDate , categoryImage } = req.body;
    const file = req.file;
    if(req.file){
        const cloudinary = require('cloudinary').v2;
        cloudinary.config({
          cloud_name: 'dckj2yfap',
          api_key: '693332219167892',
          api_secret: 'acUf4mqnUBJCwsovIz-Ws894NGY'
        });
        var path = req.file.path;
        var uniqueFilename = new Date().toISOString();
        
        cloudinary.uploader.upload(
          path,
          { public_id: `blog/newsCategoryPic/${uniqueFilename}`, tags: `blog` }, // directory and tags are optional
          function(err, image) {
            if (err) return res.send(err)
            
            // remove file from server
            const fs = require('fs');
            fs.unlinkSync(path);
            
          }
        )
      }
    try {
        var record = await new newsCategorySchema({
            newsType: newsType,
            newsDate: newsDate,
            // categoryImage: file == undefined ? null : file.path,
            categoryImage: file == undefined ? null : 'https://res.cloudinary.com/dckj2yfap/image/upload/v1601267438/blog/newsCategoryPic/'+uniqueFilename,
        });
        if(record){
            res.status(200).json({ IsSuccess: true , Data: [record] , Message: "News Category Added" });
            await record.save();
        }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "News Category Not Added"});
        }
    } catch (error) {
        res.status(500).json({ Message: error.message , IsSuccess: false });
    }
});

router.post("/getNewsCategory" , async function(req,res,next){
    try {
        var record = await newsCategorySchema.find();
        if(record){
            res.status(200).json({ IsSuccess: true , Data: record , Message: "News Category Found" });
        }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "No Category Available" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

function getCurrentDate(){
    var date = moment()
      .tz("Asia/Calcutta")
      .format("DD MM YYYY, h:mm:ss a")
      .split(",")[0];
    date = date.split(" ");
    date = date[0] + "/" + date[1] + "/" + date[2];

    return date;
}

function getCurrentTime(){
    var time = moment()
      .tz("Asia/Calcutta")
      .format("DD MM YYYY, h:mm:ss a")
      .split(",")[1];

    return time;
}

router.post("/addBus_storyCategory" , uploadCategoryImg.single("categoryImage") , async function(req,res,next){
    const { categoryType , initdate , categoryImage } = req.body;
    const file = req.file;
    if(req.file){
        const cloudinary = require('cloudinary').v2;
        cloudinary.config({
          cloud_name: 'dckj2yfap',
          api_key: '693332219167892',
          api_secret: 'acUf4mqnUBJCwsovIz-Ws894NGY'
        });
        var path = req.file.path;
        var uniqueFilename = new Date().toISOString();
        
        cloudinary.uploader.upload(
          path,
          { public_id: `blog/bus_story_category/${uniqueFilename}`, tags: `blog` }, // directory and tags are optional
          function(err, image) {
            if (err) return res.send(err)
            
            // remove file from server
            const fs = require('fs');
            fs.unlinkSync(path);
            
          }
        )
      }
    try {
        var record = await new business_storiesCategorySchema({
            categoryType: categoryType,
            initdate: initdate,
            // categoryImage: file == undefined ? null : file.path,
            categoryImage: file == undefined ? null : 'https://res.cloudinary.com/dckj2yfap/image/upload/v1601267438/blog/bus_story_category/'+uniqueFilename,
        });
        if(record){
            res.status(200).json({ IsSuccess: true , Data: [record] , Message: "Business Stories Category Added" });
            await record.save();
        }else{
            res.status(200).json({ IsSuccess: true , Data: [] , Message: "Category Not Added"});
        }
    } catch (error) {
        res.status(500).json({ Message: error.message , IsSuccess: false });
    }
});

router.post("/getbussCategory" , async function(req,res,next){
    try {
        var record = await business_storiesCategorySchema.find();
        if(record){
            res.status(200).json({ IsSuccess: true , Data: record , Message: "Business Stories Category Found" });
        }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "No Category Available" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post('/addbusiness_story', uploadNewsImg.fields([{name:'bussImage'},{name :'bussvideo'},{name:'bussAudio'}]), async function(req,res,next){
    const { categoryType , content , BusDate, BusTime , headline , bussImage ,bussvideo} = req.body;
    // const file = req.file;
    //console.log(imageData);

    var d = [];
    var e = [];
    var f = [];

    var fileinfo = req.files.bussImage;
    var filevideo = req.files.bussvideo;
    var fileaudio = req.files.bussAudio;

    if(req.files.bussImage || req.files.bussvideo || req.files.bussAudio){
        const cloudinary = require('cloudinary').v2;
        cloudinary.config({
            cloud_name: 'dckj2yfap',
            api_key: '693332219167892',
            api_secret: 'acUf4mqnUBJCwsovIz-Ws894NGY'
        });

        if(req.files.bussImage){
            for(var j =0; j < fileinfo.length; j++){
                var uniqname = "";
                uniqname = moment().format('MMMM Do YYYY, h:mm:ss a');
                var c = await cloudinary.uploader.upload(fileinfo[j].path,{ public_id: `blog/bus_story_pic/${uniqname}`, tags: `blog` },function(err,result) {
                    // console.log("Error : ", err);
                    // console.log("Resilt : ", result);
                    d[j] =result.url;
                });
            }
        }
        if(req.files.bussvideo){
            var uniqvideo = "";
            uniqvideo = moment().format('MMMM Do YYYY, h:mm:ss a');
            var v = await cloudinary.uploader.upload(filevideo[0].path, {resource_type:"video", public_id: `blog/bus_story_pic/${uniqvideo}`, tags: `blog` },function(err,result) {
            console.log("Error : ", err);
            console.log("Resilt : ", result);
            e[0] = result.url;
            });
        }
        if(req.files.bussAudio){
            var uniqaudio = "";
            uniqaudio = moment().format('MMMM Do YYYY, h:mm:ss a');
            var v = await cloudinary.uploader.upload(fileaudio[0].path,{resource_type:"video", public_id: `blog/bus_story_pic/${uniqaudio}`, tags: `blog` },function(err,result) {
            console.log("Error : ", err);
            console.log("Resilt : ", result);
            f[0] = result.url;
        });
        }
    }
    
    try {
        var newsData;
        if(req.files){
            newsData = await new bussModelSchema({
                categoryType : categoryType,
                content : content,
                BusDate : getCurrentDate(),
                BusTime : getCurrentTime(),
                headline : headline,
                bussImage : req.files == undefined ? "" : d[0],
                bussImage2 : req.files == undefined ? "" : d[1],
                bussImage3 : req.files == undefined ? "" : d[2],
                bussImage4 : req.files == undefined ? "" : d[3],
                bussImage5 : req.files == undefined ? "" : d[4],
                bussImage6 : req.files == undefined ? "" : d[5],
                bussImage7 : req.files == undefined ? "" : d[6],
                bussImage8 : req.files == undefined ? "" : d[7],
                bussImage9 : req.files == undefined ? "" : d[8],
                bussImage10 : req.files == undefined ? "" : d[9],
                bussvideo : req.files == undefined ? "" : e[0],
                bussAudio : req.files == undefined ? "" : f[0],
            });
        }else{
            newsData = await new bussModelSchema({
                newsType : newsType,
                content : content,
                newsDate : getCurrentDate(),
                newsTime : getCurrentTime(),
                headline : headline,
            });
        }
        console.log(newsData);        
        let newsDataStore = await newsData.save();

        res.status(200).json({ Message: "Business Story Added Successfully...!!!", Data: [newsDataStore], IsSuccess: true });
    } catch (error) {
        res.status(500).json({ Message: error.message, IsSuccess: false });
    }
});

router.post('/getallbusiness_stories', async function(req,res,next){
    try{
        var record = await bussModelSchema.find().populate("categoryType");
        if(record){
            res.status(200).json({ IsSuccess: true , Data: record , Message: "Stories Found" });
        }else{
            res.status(200).json({ IsSuccess: true , Data: [] , Message: "No Stories Available" });
        }
    }
    catch(err){
        res.status(500).json({ IsSuccess: false, Message: err.message });
    }
});

router.post('/addnews', uploadNewsImg.fields([{name:'newsImage'},{name :'newsvideo'},{name:'newsAudio'}]), async function(req,res,next){
    const { newsType , content , newsDate, newsTime , headline , newsImage ,newsvideo, trending , bookmark} = req.body;
    // const file = req.file;
    //console.log(imageData);

    var d = [];
    var e = [];
    var f = [];

    var fileinfo = req.files.newsImage;
    var filevideo = req.files.newsvideo;
    var fileaudio = req.files.newsAudio;

    if(req.files.newsImage || req.files.newsvideo || req.files.newsAudio){
        const cloudinary = require('cloudinary').v2;
        cloudinary.config({
            cloud_name: 'dckj2yfap',
            api_key: '693332219167892',
            api_secret: 'acUf4mqnUBJCwsovIz-Ws894NGY'
        });

        if(req.files.newsImage){
            for(var j =0; j < fileinfo.length; j++){
                var uniqname = "";
                uniqname = moment().format('MMMM Do YYYY, h:mm:ss a');
                var c = await cloudinary.uploader.upload(fileinfo[j].path,{ public_id: `blog/newsPictures/${uniqname}`, tags: `blog` },function(err,result) {
                    // console.log("Error : ", err);
                    // console.log("Resilt : ", result);
                    d[j] =result.url;
                });
            }
        }
        if(req.files.newsvideo){
            var uniqvideo = "";
            uniqvideo = moment().format('MMMM Do YYYY, h:mm:ss a');
            var v = await cloudinary.uploader.upload(filevideo[0].path, {resource_type:"video", public_id: `blog/newsPictures/${uniqvideo}`, tags: `blog` },function(err,result) {
            console.log("Error : ", err);
            console.log("Resilt : ", result);
            e[0] = result.url;
            });
        }
        if(req.files.newsAudio){
            var uniqaudio = "";
            uniqaudio = moment().format('MMMM Do YYYY, h:mm:ss a');
            var v = await cloudinary.uploader.upload(fileaudio[0].path,{resource_type:"video", public_id: `blog/newsPictures/${uniqaudio}`, tags: `blog` },function(err,result) {
            console.log("Error : ", err);
            console.log("Resilt : ", result);
            f[0] = result.url;
        });
        }
    }


    // if(req.file){
    //     const cloudinary = require('cloudinary').v2;
    //     cloudinary.config({
    //       cloud_name: 'dckj2yfap',
    //       api_key: '693332219167892',
    //       api_secret: 'acUf4mqnUBJCwsovIz-Ws894NGY'
    //     });
    //     var path = req.file.path;
    //     var uniqueFilename = new Date().toISOString();
        
    //     cloudinary.uploader.upload(
    //       path,
    //       { public_id: `blog/newsPictures/${uniqueFilename}`, tags: `blog` }, // directory and tags are optional
    //       function(err, image) {
    //         if (err) return res.send(err)
            
    //         // remove file from server
    //         const fs = require('fs');
    //         fs.unlinkSync(path);
            
    //       }
    //     )
    // }
    
    try {
        var newsData;
        if(req.files){
            newsData = await new newsModelSchema({
                newsType : newsType,
                content : content,
                newsDate : getCurrentDate(),
                newsTime : getCurrentTime(),
                headline : headline,
                newsImage : req.files == undefined ? "" : d[0],
                newsImage2 : req.files == undefined ? "" : d[1],
                newsImage3 : req.files == undefined ? "" : d[2],
                newsImage4 : req.files == undefined ? "" : d[3],
                newsImage5 : req.files == undefined ? "" : d[4],
                newsImage6 : req.files == undefined ? "" : d[5],
                newsImage7 : req.files == undefined ? "" : d[6],
                newsImage8 : req.files == undefined ? "" : d[7],
                newsImage9 : req.files == undefined ? "" : d[8],
                newsImage10 : req.files == undefined ? "" : d[9],
                newsvideo : req.files == undefined ? "" : e[0],
                newsAudio : req.files == undefined ? "" : f[0],
                trending : trending,
                bookmark : bookmark,
            });
        }else{
            newsData = await new newsModelSchema({
                newsType : newsType,
                content : content,
                newsDate : getCurrentDate(),
                newsTime : getCurrentTime(),
                headline : headline,
                bookmark : bookmark,
                trending : trending,
                bookmark : bookmark,
            });
        }
        console.log(newsData);        
        let newsDataStore = await newsData.save();

        res.status(200).json({ Message: "News Added Successfully...!!!", Data: [newsDataStore], IsSuccess: true });
    } catch (error) {
        res.status(500).json({ Message: error.message, IsSuccess: false });
    }
});



router.post('/updatenews', async function(req , res, next){
    console.log(req.body);
    const id = req.body.id;
    //const file = req.file;
    const { newsType , content , headline , trending } = req.body;
    try {
        if(req.file){
            var updateNewsData = {
                newsType : mongoose.Types.ObjectId(newsType),
                content : content,
                headline : headline,
                trending : trending,
            };
        }else{
            updateNewsData = {
                newsType : mongoose.Types.ObjectId(newsType),
                content : content,
                headline : headline,
                trending : trending,
            };
        }
        console.log(updateNewsData);
        let data = await newsModelSchema.findByIdAndUpdate(id,updateNewsData);
        res.status(200).json({ Message: "News Data Updated!", Data: data, IsSuccess: true });
    } catch (error) {
        res.status(500).json({ Message: error.message , IsSuccess: false });
    }
});

router.post('/deletenews', uploadCategoryImg.single() , async function(req,res,next){
    const {id} = req.body;
    console.log(req.body);
    try {
        let deleteNews = await newsModelSchema.findOneAndDelete({ _id : id });
        if(deleteNews != null){
            res.status(200).json({ IsSuccess : true , Data: 1 , Message : "Data Deleted...!!!" });
        }else{
            res.status(200).json({ IsSuccess : false , Data: 0 , Message : "Data Not Found...!!!" });
        }        
    } catch (error) {
        res.status(500).json({ IsSuccess : false , Data : 0 , Message : error.message });
    } 
});

router.post("/getAllNews" , async function(req,res,next){
    try {
        var record = await newsModelSchema.find().populate("newsType");
        if(record){
            res.status(200).json({ IsSuccess: true , Data: record , Message: "News Found" });
        }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "No News Available" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/getFeaturedNews" , async function(req,res,next){
    const { newsId } = req.body;
    try {
        var record = await newsModelSchema.find({ trending: true })
                                          .populate({
                                              path: "newsType",
                                          });
        if(record){
            res.status(200).json({ IsSuccess: true , Data: record , Message: "News Found" });
        }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "No News Available" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/updateToFeatured" , uploadCategoryImg.single() ,async function(req,res,next){
    const { newsId } = req.body;
    
    try {
        var record = await newsModelSchema.findByIdAndUpdate(newsId,{ trending: true },function(err,data){
            if(err){
                res.status(200).json({ IsSuccess: true , Message: err })
            }else{
                res.status(200).json({ IsSuccess: true , Message: "News is Featured" });
            }
        });
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/addBusinessCategory" , uploadBusinessCategory.single("categoryImage") , async function(req,res,next){
    const { categoryName , categoryImage , dateTime } = req.body;
    const file = req.file;
    if(req.file){
        const cloudinary = require('cloudinary').v2;
        cloudinary.config({
          cloud_name: 'dckj2yfap',
          api_key: '693332219167892',
          api_secret: 'acUf4mqnUBJCwsovIz-Ws894NGY'
        });
        var path = req.file.path;
        var uniqueFilename = new Date().toISOString();
       
        cloudinary.uploader.upload(
          path,
          { public_id: `blog/businessCategory/${uniqueFilename}`, tags: `blog` }, // directory and tags are optional
          function(err, image) {
            if (err) return res.send(err)
          
            // remove file from server
            const fs = require('fs');
            fs.unlinkSync(path);
            
          }
        )
      }
    try {
        var record = await new businessCategorySchema({
            categoryName: categoryName,
            categoryImage: file == undefined ? "" : 'https://res.cloudinary.com/dckj2yfap/image/upload/v1601267438/blog/businessCategory/'+uniqueFilename,
            dateTime: dateTime
        });
        if(record){
            await record.save();
            res.status(200).json({ IsSuccess: true , Data: record , Message: "Business Category Added" });
        }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "Not Added" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/updateBusinessCategory" , uploadBusinessCategory.single("categoryImage") , async function(req,res,next){
    const { categoryName , categoryId , dateTime } = req.body;
    const file = req.file;
    if(req.file){
        const cloudinary = require('cloudinary').v2;
        cloudinary.config({
          cloud_name: 'dckj2yfap',
          api_key: '693332219167892',
          api_secret: 'acUf4mqnUBJCwsovIz-Ws894NGY'
        });
        var path = req.file.path;
        var uniqueFilename = new Date().toISOString();
       
        cloudinary.uploader.upload(
          path,
          { public_id: `blog/businessCategory/${uniqueFilename}`, tags: `blog` }, // directory and tags are optional
          function(err, image) {
            if (err) return res.send(err)
          
            // remove file from server
            const fs = require('fs');
            fs.unlinkSync(path);
            
          }
        )
      }
    try {
        let updateIs = {
            categoryName: categoryName,
            categoryImage: file == undefined ? "" : 'https://res.cloudinary.com/dckj2yfap/image/upload/v1601267438/blog/businessCategory/'+uniqueFilename,
            dateTime: dateTime,
        }
        let record = await businessCategorySchema.find({ _id: categoryId });
        if(record.length == 1){
            let updateData = await businessCategorySchema.findByIdAndUpdate(categoryId,updateIs);
            res.status(200).json({ IsSuccess: true , Data: record , Message: "Business Category Updated" });
        }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "Not Updated" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

//Get All Business Category
router.post("/businessCategory" , async function(req , res ,next){
    try {
        var record = await businessCategorySchema.find();
        
        if(record){
            res.status(200).json({ IsSuccess: true , Data: record , Message: "Business Category Found" });
        }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "No Business Category Available" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/usersInBusinessCategory" , async function(req,res,next){
    const { businessCategory_id } = req.body;
    try {
        var record = await directoryData.find({ business_category: mongoose.Types.ObjectId(businessCategory_id) });
        if(record){
            res.status(200).json({ IsSuccess: true , Data: record , Message: "Business Category Users Found" });
        }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "Empty UserList" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    } 
});

router.post("/getNewsOfCategory" , async function(req,res,next){
    const id = req.body.id;
    try {
        var record = await newsModelSchema.find({ newsType : {_id : id} })
                                          .populate({
                                            path: "newsType",
                                           });
        
        if(record){
            res.status(200).json({ IsSuccess: true , Data: record , Message: "News Found" });
        }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "No News Available" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});


router.post("/addBanner" , uploadbanner.single("image"), async function(req,res,next){
    const { title, type } = req.body;

    if(req.file){
        const cloudinary = require('cloudinary').v2;
        cloudinary.config({
          cloud_name: 'dckj2yfap',
          api_key: '693332219167892',
          api_secret: 'acUf4mqnUBJCwsovIz-Ws894NGY'
        });
        var path = req.file.path;
        var uniqueFilename = new Date().toISOString();
       
        cloudinary.uploader.upload(
          path,
          { public_id: `blog/banner/${uniqueFilename}`, tags: `blog` }, // directory and tags are optional
          function(err, image) {
            if (err) return res.send(err)
          
            // remove file from server
            const fs = require('fs');
            fs.unlinkSync(path);
            
          }
        )
      }
    
    try {
        const file = req.file;
        let newbanner = new bannerSchema({
            title: title,
            type: type,
            image: file == undefined ? null : 'https://res.cloudinary.com/dckj2yfap/image/upload/v1601267438/blog/banner/'+uniqueFilename,
        });
        await newbanner.save();
        res
            .status(200)
            .json({ Message: "Banner Added!", Data: 1, IsSuccess: true });
    } catch (err) {
        res.status(500).json({
            Message: err.message,
            Data: 0,
            IsSuccess: false,
        });
    }
});

router.post("/getAllBanner" , async function(req,res,next){
    try {
        var record = await bannerModel.find();
        if(record){
            res.status(200).json({ IsSuccess: true , Data: record , Message: "Banner Found" });
        }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "No Banner Available" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/offer" , uploadOfferbanner.single("bannerImage") , async function(req,res,next){
    const { title , bannerImage ,userId, businessCategory , dateTime , details ,redeemBy , 
        offerExpire ,faceBook , instagram , linkedIn , twitter , whatsApp , youTube  } = req.body;
    
    var expire = moment(offerExpire);
    expire = expire.utc().format('DD/MM/YYYY');
    var expireBody = moment(offerExpire);
    expireBody = expireBody.utc().format('DD/MM/YYYY');

    var initialDate = moment(dateTime);
    initialDate = initialDate.utc().format('DD/MM/YYYY');

    var bodyInitialDate = moment(dateTime);
    bodyInitialDate = bodyInitialDate.utc().format('DD/MM/YYYY');

    let date1 = new Date(initialDate);
    let date2 = new Date(expire);

    var daysRemaining = Math.abs( date1.getDate() - date2.getDate() );
    // console.log(daysRemaining);

    if(req.file){
        const cloudinary = require('cloudinary').v2;
        cloudinary.config({
          cloud_name: 'dckj2yfap',
          api_key: '693332219167892',
          api_secret: 'acUf4mqnUBJCwsovIz-Ws894NGY'
        });
        var path = req.file.path;
        var uniqueFilename = new Date().toISOString();
       
        cloudinary.uploader.upload(
          path,
          { public_id: `blog/offer/${uniqueFilename}`, tags: `blog` }, // directory and tags are optional
          function(err, image) {
            if (err) return res.send(err)
          
            // remove file from server
            const fs = require('fs');
            fs.unlinkSync(path);
            
          }
        )
    }

    try {
        const file = req.file;
        var record = await new offerSchema({
            title: title,
            // type: type,
            details: details,
            redeemBy: redeemBy,
            bannerImage: file == undefined ? "" : 'https://res.cloudinary.com/dckj2yfap/image/upload/v1601267438/blog/offer/'+uniqueFilename,
            dateTime: dateTime,
            offerExpire: offerExpire,
            businessCategory: businessCategory,
            daysRemain: daysRemaining,
            userId:userId,
            faceBook: faceBook,
            instagram: instagram,
            linkedIn: linkedIn,
            twitter: twitter,
            whatsApp: whatsApp,
            youTube: youTube,
        });
        await record.save();
        if(record){
            res.status(200)
               .json({ IsSuccess: true , Data: [record] , Message: "Offer Added" });
        }else{
            res.status(200)
               .json({ IsSuccess: true , Data: 0 , Message: "Offer not Added" });
        }
    } catch (error) {
        res.status(500)
           .json({
               IsSuccess: false,
               Data: 0,
               Message: error.message
           });
    }
});

router.post("/getOfferOfBusiness" , async function(req,res,next){
    const { businessCategory_id } = req.body;
    try {
        var record  = await offerSchema.find({ businessCategory: { _id: businessCategory_id } })
                                       .populate({
                                           path: "businessCategory",
                                       });
        // console.log(record);
        if(record){
            res.status(200)
               .json({ IsSuccess: true , Data: record , Message: "Offer Found" });
        }else{
            res.status(200)
               .json({ IsSuccess: true , Data: 0 , Message: "Offer not Found" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/updateOffer" , async function(req,res,next){
    const {  id, title , bannerImage , dateTime ,offerExpire, businessCategory ,faceBook,instagram,whatsApp,linkedIn,youTube, details ,redeemBy } = req.body;
    console.log(req.body);
    const file = req.file;
    try {

        if(req.file){
            const cloudinary = require('cloudinary').v2;
            cloudinary.config({
              cloud_name: 'dckj2yfap',
              api_key: '693332219167892',
              api_secret: 'acUf4mqnUBJCwsovIz-Ws894NGY'
            });
            var path = req.file.path;
            var uniqueFilename = new Date().toISOString();
           
            cloudinary.uploader.upload(
              path,
              { public_id: `blog/offer/${uniqueFilename}`, tags: `blog` }, // directory and tags are optional
              function(err, image) {
                if (err) return res.send(err)
              
                // remove file from server
                const fs = require('fs');
                fs.unlinkSync(path);
                
              }
            )
        }

        var newdata = {
                title: title,
                businessCategory: businessCategory,
                details: details,
                redeemBy: redeemBy,
                dateTime : dateTime,
                offerExpire : offerExpire,
                faceBook : faceBook,
                instagram : instagram,
                whatsApp : whatsApp,
                linkedIn : linkedIn,
                youTube : youTube,
                bannerImage : file == undefined ? "" : 'https://res.cloudinary.com/dckj2yfap/image/upload/v1601267438/blog/offer/'+uniqueFilename,
        };

        //const file = req.file;dateTime
        // var existOffer = await offerSchema.find();
        //var record;
        var ExistData = await offerSchema.find({ _id: id });
        // console.log("record................." + ExistData);
        console.log("Record length---------------" + ExistData.length);
        if(ExistData.length == 1){
            var record = await offerSchema.findByIdAndUpdate(id  ,newdata);
            console.log("-------------------------------");
            console.log(record);
        }
        
        console.log(record);
        
        if(record){
            res.status(200)
               .json({ IsSuccess: true , Data: 1 , Message: "Offer Updated" });
        }else{
            res.status(200)
               .json({ IsSuccess: true , Data: 0 , Message: "Offer not Update" });
        }
    } catch (error) {
        res.status(500)
           .json({
               IsSuccess: false,
               Data: 0,
               Message: error.message
           });
    }
});

router.post("/deleteOffer" , async function(req,res,next){
    const id = req.body.id;
    try {
        //const file = req.file;dateTime
        // var existOffer = await offerSchema.find();
        //var record;
        var ExistData = await offerSchema.find({ _id: id });
        if(ExistData.length == 1){
            var record = await offerSchema.findByIdAndDelete(id);
        }
        
        if(record){
            res.status(200)
               .json({ IsSuccess: true , Data: record , Message: "Offer Deleted" });
        }else{
            res.status(200)
               .json({ IsSuccess: true , Data: 0 , Message: "Offer not Delete" });
        }
    } catch (error) {
        res.status(500)
           .json({
               IsSuccess: false,
               Data: 0,
               Message: error.message
           });
    }
});

router.post("/getOffer" , async function(req,res,next){
    try {
        var record = await offerSchema.find()
                                      .populate({
                                            path: "businessCategory",
                                        });
        if(record){
            res.status(200).json({ IsSuccess: true , Data: record , Message: "Offers Found" });
        }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "No Offer" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/getOfferbyUser" , async function(req,res,next){
    const id = req.body.id;
    console.log(id);
    try {
        var record = await offerSchema.find({userId : id})
                                      .populate({
                                            path: "businessCategory",
                                        });
        if(record){
            res.status(200).json({ IsSuccess: true , Data: record , Message: "Offers Found" });
        }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "No USer Offer Found" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/addSuccessStory" , uploadSuccessStory.single("storyImage") , async function(req,res,next){
    const { headline , storyImage , storyContent , favorite , date, time,
        faceBook , instagram , linkedIn , twitter , whatsApp , youTube, mail, website } = req.body; 
    const file = req.file;
    if(req.file){
        const cloudinary = require('cloudinary').v2;
        cloudinary.config({
          cloud_name: 'dckj2yfap',
          api_key: '693332219167892',
          api_secret: 'acUf4mqnUBJCwsovIz-Ws894NGY'
        });
        var path = req.file.path;
        var uniqueFilename = new Date().toISOString();
       
        cloudinary.uploader.upload(
          path,
          { public_id: `blog/successStory/${uniqueFilename}`, tags: `blog` }, // directory and tags are optional
          function(err, image) {
            if (err) return res.send(err)
          
            // remove file from server
            const fs = require('fs');
            fs.unlinkSync(path);
            
          }
        )
      }
    try {
        var record = await new successStorySchema({
            headline: headline,
            storyImage: file == undefined ? "" : 'https://res.cloudinary.com/dckj2yfap/image/upload/v1601267438/blog/successStory/'+uniqueFilename,
            storyContent: storyContent,
            favorite: favorite,
            date: getCurrentDate(),
            time: getCurrentTime(),
            faceBook: faceBook,
            instagram: instagram,
            linkedIn: linkedIn,
            twitter: twitter,
            whatsApp: whatsApp,
            youTube: youTube,
            mail : mail,
            website : website,
        });
        if(record){
            res.status(200).json({ IsSuccess: true , Data: [record] , Message: "Success Story Added" });
            await record.save();
        }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "Story Not Added" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/getSuccessStory" , async function(req,res,next){
    try {
        var record = await successStorySchema.find();
        console.log(record);
        if(record){
            res.status(200).json({ IsSuccess: true , Data: record , Message: "Success Story Found" });
        }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "Story Not found" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/updateSuccessStory", uploadSuccessStory.single("storyImage") ,async function(req,res,next){
    const { headline , storyId , storyContent , favorite , date, time,storyImage,
        faceBook , instagram , linkedIn , twitter , whatsApp , youTube } = req.body; 
    const file = req.file;
    if(req.file){
        const cloudinary = require('cloudinary').v2;
        cloudinary.config({
          cloud_name: 'dckj2yfap',
          api_key: '693332219167892',
          api_secret: 'acUf4mqnUBJCwsovIz-Ws894NGY'
        });
        var path = req.file.path;
        var uniqueFilename = new Date().toISOString();
       
        cloudinary.uploader.upload(
          path,
          { public_id: `blog/successStory/${uniqueFilename}`, tags: `blog` }, // directory and tags are optional
          function(err, image) {
            if (err) return res.send(err)
          
            // remove file from server
            const fs = require('fs');
            fs.unlinkSync(path);
            
          }
        )
      }
      try {
          var updateIs = {
            headline: headline,
            storyImage: file == undefined ? "" : 'https://res.cloudinary.com/dckj2yfap/image/upload/v1601267438/blog/successStory/'+uniqueFilename,
            storyContent: storyContent,
            favorite: favorite,
            date: getCurrentDate(),
            time: getCurrentTime(),
            faceBook: faceBook,
            instagram: instagram,
            linkedIn: linkedIn,
            twitter: twitter,
            whatsApp: whatsApp,
            youTube: youTube,
          }
          var record = await successStorySchema.find({ _id: storyId });
          if(record.length == 1){
              let updateData = await successStorySchema.findByIdAndUpdate(storyId,updateIs);
              res.status(200).json({ IsSuccess: true , Data: 1 , Message: "SuccessStory Updated" });
          }
      } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
      }
});
// router.post("/addEvent" , uploadEvent.single("eventImage") , async function(req,res,next){
//     const { eventName , eventImage , eventOrganiseBy , startDate , endDate ,
//             startFromTime , startToTime, endFromTime , endToTime } = req.body; 

//     const file = req.file;
//     var initialDateTime = moment(startDate);
//     var endDateTime = moment(endDate);
//     var initialDate = initialDateTime.utc().format('DD/MM/YYYY');
//     var initialTime = initialDateTime.utc().format('h:mm a');
//     var end_Date = endDateTime.utc().format('DD/MM/YYYY');
//     var end_Time = endDateTime.utc().format('h:mm a');
    
//     try {
//         var record = await new eventSchema({
//             eventName: eventName,
//             eventImage: file == undefined ? null : file.path,
//             eventOrganiseBy: eventOrganiseBy,
//             startDate: [initialDate , initialTime],
//             endDate: [end_Date , end_Time],
//         });
//         //console.log(record);
//         if(record){
//             res.status(200).json({ IsSuccess: true , Data: [record] , Message: "Event Added" });
//             await record.save();
//         }else{
//             res.status(200).json({ IsSuccess: true , Data: 0 , Message: "Event Not Added" });
//         }
//     } catch (error) {
//         res.status(500).json({ IsSuccess: false , Message: error.message });
//     }
// });

function cloudImage(folderName){
    const cloudinary = require('cloudinary').v2;
        cloudinary.config({
          cloud_name: 'dckj2yfap',
          api_key: '693332219167892',
          api_secret: 'acUf4mqnUBJCwsovIz-Ws894NGY'
        });
        var path = req.file.path;
        var uniqueFilename = new Date().toISOString();
       
        cloudinary.uploader.upload(
          path,
          { public_id: `blog/${folderName}/${uniqueFilename}`, tags: `blog` }, // directory and tags are optional
          function(err, image) {
            if (err) return res.send(err)
          
            // remove file from server
            const fs = require('fs');
            fs.unlinkSync(path);
            
          }
        )
    // return uniqueFilename;
}

router.post("/addEvent" , uploadEvent.single("eventImage") , async function(req,res,next){
    const { eventName ,city,eventaddress, eventImage , eventOrganiseBy , startDate , endDate , description,
             startTime, endTime , faceBook , instagram , linkedIn , twitter , whatsApp , youTube } = req.body; 

    const file = req.file;

    if(req.file){
        const cloudinary = require('cloudinary').v2;
        cloudinary.config({
          cloud_name: 'dckj2yfap',
          api_key: '693332219167892',
          api_secret: 'acUf4mqnUBJCwsovIz-Ws894NGY'
        });
        var path = req.file.path;
        var uniqueFilename = new Date().toISOString();
       
        cloudinary.uploader.upload(
          path,
          { public_id: `blog/events/${uniqueFilename}`, tags: `blog` }, // directory and tags are optional
          function(err, image) {
            if (err) return res.send(err)
          
            // remove file from server
            const fs = require('fs');
            fs.unlinkSync(path);
            
          }
        )
      }
    // var initialDateTime = moment(startDate);
    // var endDateTime = moment(endDate);
    // var initialDate = initialDateTime.utc().format('DD/MM/YYYY');
    // var initialTime = initialDateTime.utc().format('h:mm a');
    // var end_Date = endDateTime.utc().format('DD/MM/YYYY');
    // var end_Time = endDateTime.utc().format('h:mm a');
    
    try {
        var record = await new eventSchema({
            eventName: eventName,
            eventImage: file == undefined ? "" : 'https://res.cloudinary.com/dckj2yfap/image/upload/v1601267438/blog/events/'+uniqueFilename,
            eventOrganiseBy: eventOrganiseBy,
            city : city,
            eventaddress : eventaddress,
            startDate: startDate,
            startTime: startTime,
            endDate: endDate,
            endTime: endTime,
            description: description,
            faceBook: faceBook,
            instagram: instagram,
            linkedIn: linkedIn,
            twitter: twitter,
            whatsApp: whatsApp,
            youTube: youTube,
        });
        //console.log(record);
        if(record){
            res.status(200).json({ IsSuccess: true , Data: record , Message: "Event Added" });
            await record.save();
        }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "Event Not Added" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post('/eventRegister', async function(req,res,next){
    const {eventid , userid} = req.body;
    try{
        if(req.body){
            var isevent = await eventregSchema.find({ $and: [{eventid : eventid}, {userid:userid}] })
            if(isevent.length == 1){
                res.status(200).json({
                    Message: "User Already Registered!",
                    Data: [],
                    IsSuccess: true,
                });
            }
            else{
                let evereg = new eventregSchema({
                    eventid : eventid,
                    userid : userid   
                });
                evereg.save();
                res.status(200).json({ Message: "User Registered!", Data: [evereg], IsSuccess: true });
            }
        }
    }
    catch(err){
        res.status(500).json({ IsSuccess: false , Message: err.message });
    }
});

router.post("/getregevent", async function(req,res,next){
    var userid = req.body.userid;
    try{
        var evedata = await eventregSchema.find({userid:userid});
        if(evedata.length == 0){
            res.status(200).json({IsSuccess : true, Data : 0, Message : "No Event Found"});
        }
        else{
            res.status(200).json({IsSuccess : true, Data : evedata, Message : "Event Found"});
        }
    }
    catch(err){
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post('/eventicket',async function(req,res,next){
    const {eventid , userid} = req.body;
    try{
        var data = await eventregSchema.find({ $and: [{eventid : eventid}, {userid:userid}] })
                                        .populate({
                                            path : "eventid"
                                        })
                                        .populate({
                                            path : "userid",
                                            select : "name mobile email"
                                        });
        if(data.length != 0){
            res.status(200).json({IsSuccess : true, Data : data, Message : "Ticket Found"})
        }
        else{
            res.status(200).json({IsSuccess : true, Data : 0, Message : "Please Register First"})
        }
    }
    catch(err){
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/getEvents" , async function(req,res,next){
    try {
        var record = await eventSchema.find()
                                        .populate("city");
        console.log(record);
        if(record){
            res.status(200).json({ IsSuccess: true , Data: record , Message: "Events Found" });
        }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "Events Not found" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/updateEvent", uploadEvent.single("eventImage") , async function(req,res,next){
    const { eventId , eventName ,city,eventaddress, eventOrganiseBy ,eventImage, startDate , endDate , description,
        startTime, endTime , faceBook , instagram , linkedIn , twitter , whatsApp , 
        youTube } = req.body;
    
    const file = req.file;

    try {
        if(req.file){
            const cloudinary = require('cloudinary').v2;
            cloudinary.config({
              cloud_name: 'dckj2yfap',
              api_key: '693332219167892',
              api_secret: 'acUf4mqnUBJCwsovIz-Ws894NGY'
            });
            var path = req.file.path;
            var uniqueFilename = new Date().toISOString();
           
            cloudinary.uploader.upload(
              path,
              { public_id: `blog/events/${uniqueFilename}`, tags: `blog` }, // directory and tags are optional
              function(err, image) {
                if (err) return res.send(err)
              
                // remove file from server
                const fs = require('fs');
                fs.unlinkSync(path);
                
              }
            )
        }
        var updateIs = {
            eventName: eventName,
            eventImage: file == null ? "" : 'https://res.cloudinary.com/dckj2yfap/image/upload/v1601267438/blog/events/'+uniqueFilename,
            eventOrganiseBy: eventOrganiseBy,
            city : city,
            eventaddress : eventaddress,
            startDate: startDate,
            startTime: startTime,
            endDate: endDate,
            endTime: endTime,
            description: description,
            faceBook: faceBook,
            instagram: instagram,
            linkedIn: linkedIn,
            twitter: twitter,
            whatsApp: whatsApp,
            youTube: youTube,
        }
        var record = await eventSchema.find({ _id: eventId });
        console.log(record);
        console.log(record.length);
        if(record.length == 1){
            let updateEvent = await eventSchema.findByIdAndUpdate(eventId,updateIs);
            res.status(200).json({ IsSuccess: true , Data: 1 , Message: "Event Updated" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/addToBookMark", async function(req,res,next){
    const { userId , newsId } = req.body;
    try {
        var record = await new bookMarkSchema({
            userId: userId,
            newsId: newsId,
            date: getCurrentDate(),
            time: getCurrentTime(),
        });
        if(record){
            record.save();
            res.status(200).json({ IsSuccess: true , Data: 1 , Message: "Added To BookMark" });
        }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "Something Wrong" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/getAllBookMarkNews" , async function(req,res,next){
    const { userId } = req.body;
    try {
        var record = await bookMarkSchema.find({ userId: userId })
                                         .populate({
                                             path: "userId",
                                             select: "name mobile email company_name business_category"
                                         });
                                        //  .populate({
                                        //     path: "newsId",
                                        // });
        // console.log(record);
        if(record){
            res.status(200).json({ IsSuccess: true , Data: record , Message: "Bookmark News Found" });
        }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "No Bookmark News Available" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/addMemberShip", uploadMemberShip.single("logo") , async function(req,res,next){
    const { memberShipName } = req.body;
    const file = req.file;

    if(req.file){
        const cloudinary = require('cloudinary').v2;
        cloudinary.config({
          cloud_name: 'dckj2yfap',
          api_key: '693332219167892',
          api_secret: 'acUf4mqnUBJCwsovIz-Ws894NGY'
        });
        var path = req.file.path;
        var uniqueFilename = new Date().toISOString();
       
        cloudinary.uploader.upload(
          path,
          { public_id: `blog/memberShip/${uniqueFilename}`, tags: `blog` }, // directory and tags are optional
          function(err, image) {
            if (err) return res.send(err)
          
            // remove file from server
            const fs = require('fs');
            fs.unlinkSync(path);
            
          }
        )
      }

    try {
        var record = await new memberModelSchema({
            memberShipName: memberShipName,
            logo: file == undefined ? "" : 'https://res.cloudinary.com/dckj2yfap/image/upload/v1601267438/blog/memberShip/'+uniqueFilename, 
        });
        if(record){
            record.save();
            res.status(200).json({ IsSuccess: true , Data: [record] , Message: "MemberShip Added" });
        }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "Not Added" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/updateMemberShip", uploadMemberShip.single("logo") , async function(req,res,next){
    const { memberShipId , memberShipName,logo } = req.body;
    const file = req.file;
    // console.log("PAth---------------" + req.file.path);

    if(req.file){
        console.log("1");
        const cloudinary = require('cloudinary').v2;
        cloudinary.config({
          cloud_name: 'dckj2yfap',
          api_key: '693332219167892',
          api_secret: 'acUf4mqnUBJCwsovIz-Ws894NGY'
        });
        var path = req.file.path;
        var uniqueFilename = new Date().toISOString();
       
        cloudinary.uploader.upload(
          path,
          { public_id: `blog/memberShip/${uniqueFilename}`, tags: `blog` }, // directory and tags are optional
          function(err, image) {
            if (err) return res.send(err)
          
            // remove file from server
            const fs = require('fs');
            fs.unlinkSync(path);
            
          }
        )
      }

    try {
        let updateIs = {
            memberShipName: memberShipName,
            logo: file == undefined ? "" : 'https://res.cloudinary.com/dckj2yfap/image/upload/v1601267438/blog/memberShip/'+uniqueFilename,
        }
        var record = await memberModelSchema.find({ _id: memberShipId });
        console.log(record);
        if(record.length == 1){
            let updateData = await memberModelSchema.findByIdAndUpdate(memberShipId,updateIs);
            res.status(200).json({ IsSuccess: true , Data: 1 , Message: "MemberShip Updated" });
        }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "MemberShip Not Found" });
        }    
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/getAllMemberCategory" ,async function(req,res,next){
    try {
        var record = await memberModelSchema.find();
        if(record){
            res.status(200).json({ IsSuccess: true , Data: record , Message: "MemberShips Founds" });
        }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "Not Found" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

//API from hansil GetID

router.post('/getsingleid', async function(req,res,next) {
    const id = req.body.id;
    console.log(id);
    try{
    var name_id = await directoryData.find({_id : id});
    if(name_id){
    res.status(200).json({ Message : "Member Found", Data : name_id, IsSuccess : true});
    }
    else{
    res.status(200).json({ Message : "Member Not Found", Data : 0, IsSuccess : true});
    }
    }
    catch(err)
    {
    res.status(500).json({ Message: error.message, IsSuccess: false });
    }
});
    
router.post('/getsingleoffer', async function(req,res,next) {
    const id2 = req.body.id;
    try{
    var offer_id = await offerSchema.find({_id : id2});
    if(offer_id){
    res.status(200).json({ Message : "Offer Found", Data : offer_id, IsSuccess : true});
    }
    else{
    res.status(200).json({ Message : "Offer Not Found", Data : 0, IsSuccess : true});
    }
    }
    catch(err){
    res.status(500).json({ Message: error.message, IsSuccess: false });
    }
})
    
router.post('/getsinglenews', async function(req,res, next) {
    const id3 = req.body.id;
    // console.log(id);
    try{
    var news = await newsModelSchema.find({_id : id3});
    console.log(news);
    if(news){
    res.status(200).json({ Message : "News Found", Data : news, IsSuccess : true});
    }
    else{
    res.status(200).json({ Message : "News Not Found", Data : 0, IsSuccess : true});
    }
    }
    catch(err)
    {
    res.status(500).json({ Message: error.message, IsSuccess: false });
    }
});

router.post('/getsingleevent', async function(req,res,next) {
    const id4 = req.body.id;
    try{
    var eventid = await eventSchema.find({_id : id4});
    if(eventid){
    res.status(200).json({ Message : "Event Found", Data : eventid, IsSuccess : true});
    }
    else{
    res.status(200).json({ Message : "Event Not Found", Data : 0, IsSuccess : true});
    }
    }
    catch(err){
    res.status(500).json({ Message: error.message, IsSuccess: false });
    }
});
    
router.post('/getsinglesuccess', async function(req,res,next) {
    const id5 = req.body.id;
    try{
    var succid = await successStorySchema.find({_id : id5});
    if(succid){
    res.status(200).json({ Message : "Success Story Found", Data : succid, IsSuccess : true});
    }
    else {
    res.status(200).json({ Message : "Success Story Not Found", Data : 0, IsSuccess : true});
    }
    }
    catch(err){
    res.status(500).json({ Message: error.message, IsSuccess: false });
    }
});
    
router.post('/getsinglemembership', async function(req,res,next) {
    const id6 = req.body.id;
    try{
    var memid = await memberModelSchema.find({_id : id6});
    if(memid){
    res.status(200).json({ Message : "Membership Found" , Data : memid, IsSuccess : true});
    }
    else{
    res.status(200).json({ Message : "Membership Not Found" , Data : 0, IsSuccess : true});
    }
    }
    catch(err){
    res.status(500).json({ Message: error.message, IsSuccess: false });
    }
});
    
router.post('/getsinglebuscat', async function(req,res,next) {
    const id7 = req.body.id;
    try{
    var buscaid = await businessCategorySchema.find({_id : id7});
    if(buscaid){
    res.status(200).json({ Message : "Business Category Found" , Data : buscaid, IsSuccess : true});
    }
    else{
    res.status(200).json({ Message : "Business Category Not Found" , Data : 0, IsSuccess : true});
    }
    }
    catch(err){
    res.status(500).json({ Message: error.message, IsSuccess: false });
    }
});

router.post('/getsinglecategory', async function(req,res,next) {
    const id8 = req.body.id;
    try{
    var catid = await newsCategorySchema.find({_id : id8});
    if(catid){
    res.status(200).json({ Message : "Category Found" , Data : catid, IsSuccess : true});
    }
    else{
    res.status(200).json({ Message : "Category Not Found" , Data : 0, IsSuccess : true});
    }
    }
    catch(err){
    res.status(500).json({ Message: error.message, IsSuccess: false });
    }
});

// DELETE API FROM HANSIL  -  21/12/2020

router.post('/deleteUser' ,async function(req,res,next) {
    var id =  req.body.id;
    try {
      let data = await directoryData.findByIdAndDelete(id);
      if(data) {
        res.status(200).json({ Message : "Deleted Successfully" ,Data : 1, IsSuccess : true});
      }
      else{
        res.status(200).json({ Message : "User Not Found" , Data : 0, IsSuccess : true});
      }
  
    }
    catch (err){
      res.status(500).json({ Message: err.message, Data: 0, IsSuccess: false });
    }
});

router.post('/delbanner' ,async function(req,res,next) {
    var id = req.body.id;
    try {
    let data = await bannerSchema.findByIdAndDelete(id);
    if(data) {
    res.status(200).json({ Message : "Deleted Successfully" ,Data : 1, IsSuccess : true});
    }
    else{
    res.status(200).json({ Message : "User Not Found" , Data : 0, IsSuccess : true});
    }
    }
    catch (err){
    res.status(500).json({ Message: err.message, Data: 0, IsSuccess: false });
    }
});
    
router.post('/delbuscategory' ,async function(req,res,next) {
    var id = req.body.id;
    try {
    let data = await businessCategorySchema.findByIdAndDelete(id);
    if(data) {
    res.status(200).json({ Message : "Deleted Successfully" ,Data : 1, IsSuccess : true});
    }
    else{
    res.status(200).json({ Message : "User Not Found" , Data : 0, IsSuccess : true});
    }
    }
    catch (err){
    res.status(500).json({ Message: err.message, Data: 0, IsSuccess: false });
    }
});

router.post('/delcategory' ,async function(req,res,next) {
    var id = req.body.id;
    try {
    let data = await newsCategorySchema.findByIdAndDelete(id);
    if(data) {
    res.status(200).json({ Message : "Deleted Successfully" ,Data : 1, IsSuccess : true});
    }
    else{
    res.status(200).json({ Message : "User Not Found" , Data : 0, IsSuccess : true});
    }
    }
    catch (err){
    res.status(500).json({ Message: err.message, Data: 0, IsSuccess: false });
    }
});
    
router.post('/delevent' ,async function(req,res,next) {
    var id = req.body.id;
    try {
    let data = await eventSchema.findByIdAndDelete(id);
    if(data) {
    res.status(200).json({ Message : "Deleted Successfully" ,Data : 1, IsSuccess : true});
    }
    else{
    res.status(200).json({ Message : "User Not Found" , Data : 0, IsSuccess : true});
    }
    }
    catch (err){
    res.status(500).json({ Message: err.message, Data: 0, IsSuccess: false });
    }
});
    
router.post('/delmembership' ,async function(req,res,next) {
    var id = req.body.id;
    try {
    let data = await memberModelSchema.findByIdAndDelete(id);
    if(data) {
    res.status(200).json({ Message : "Deleted Successfully" ,Data : 1, IsSuccess : true});
    }
    else{
    res.status(200).json({ Message : "User Not Found" , Data : 0, IsSuccess : true});
    }
    }
    catch (err){
    res.status(500).json({ Message: err.message, Data: 0, IsSuccess: false });
    }
});

router.post('/delsuccess' ,async function(req,res,next) {
    var id = req.body.id;
    try {
    let data = await successStorySchema.findByIdAndDelete(id);
    if(data) {
    res.status(200).json({ Message : "Deleted Successfully" ,Data : 1, IsSuccess : true});
    }
    else{
    res.status(200).json({ Message : "User Not Found" , Data : 0, IsSuccess : true});
    }
    }
    catch (err){
    res.status(500).json({ Message: err.message, Data: 0, IsSuccess: false });
    }
});

router.post("/verifymember", async function(req,res,next){
    const id = req.body.id;
    try{
        var findmember = await directoryData.find({_id : id});
        if(findmember.length == 0){
            res.status(200).json({ Message : "User Not Found" , Data : 0, IsSuccess : true});
        }
        else{
            var changestatus = {ismember : true};
            var data = await directoryData.findByIdAndUpdate(id, changestatus);
            res.status(200).json({IsSuccess : true, Data : 1, Message : "Updated Succesfull"});
        }
    }
    catch(err){
        res.status(500).json({ Message: err.message, Data: 0, IsSuccess: false });
    }
});

router.post("/inquiry", async function(req,res,next){
    const {name, email, mobile, description} = req.body;
    try{
        var data = await new inquirySchema({
            name : name,
            email : email,
            mobile : mobile,
            description : description,
        })
        if(data){
            data.save();
            res.status(200).json({IsSuccess : true, Data : [data], Message : "Inquiry send"});
        }
        else{
            res.status(200).json({IsSuccess : true, Data : [], Message : "Inquiry Not send"});
        }
    }
    catch(err){
    res.status(500).json({ Message: err.message, Data: 0, IsSuccess: false });
    }
});

router.post("/getinquiry", async function(req,res,next){
    try{
        var allinquiry = await inquirySchema.find();
        if(allinquiry.length == 0){
            res.status(200).json({IsSuccess : true, Data : 0, Message : "Incorrect Data"});
        }
        else{
            res.status(200).json({IsSuccess : true, Data : allinquiry, Message : "Data Found"});
        }
    }
    catch(err){
    res.status(500).json({ Message: err.message, Data: 0, IsSuccess: false });
    }
});

router.post("/acceptinquiry", async function(req,res,next){
    const id = req.body.id;
    try{
        var findid = await inquirySchema.find({_id : id });
        if(findid.length == 0){
            res.status(200).json({IsSuccess : true, Data : 0, Message : "No Inquiry Found"});
        }
        else{
            let updateid = {status : true};
            var updatestate = await inquirySchema.findByIdAndUpdate(id, updateid);
            res.status(200).json({IsSuccess : true, Data : 1, Message : "Inquiry Updated"});
        }
    }
    catch(err){
        res.status(500).json({ Message: err.message, Data: 0, IsSuccess: false });
    }
});

router.post("/notifyall", async function(req,res,next){
    var message = req.body.message;
    var title = req.body.Title;
    // console.log("Message"+message);
    try{
      var usernumber = await directoryData.find();
      for(let v=0; v < usernumber.length; v++){
        // console.log("user name" +  usernumber[v].name);
        // console.log("user name : " +  usernumber[v]._id);
        let objDate = new Date();
        let stringDate = objDate.toString();
        let dateList = stringDate.split(" ");
        dateList = moment().format('MMMM Do YYYY, h:mm:ss a');

        // var info = await userSchemaModel.find({mobileNumber : mobile});
        // console.log("FCM Token" + info[0].token);
        let newOrderNotification = `Title : ${title}
        Message : ${message}
        Date-Time : ${dateList}`;

        var dataSendToAdmin = {
          "to":usernumber[v].fcmToken,
          "priority":"high",
          "content_available":true,
          "data": {
              "sound": "surprise.mp3",
              "click_action": "FLUTTER_NOTIFICATION_CLICK"
          },
          "notification":{
                      "body": newOrderNotification,
                      "title":"New Notificatin Received",
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
          console.log(myJsonBody[51]);
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
      
      // if(info.length !=0 ){
          // console.log(info[i].token);
          res.status(200).json({IsSuccess : true, Data : 1, Message : "Done"})
      // }
      // else{
        // res.status(200).json({IsSuccess : true, Data : 0, Message : "Data Not found"});
      // }
    }
    catch(err){
      res.status(500).json({ IsSuccess: false , Message: err.message });
    }
});

router.post("/getsingleuserbookmark", async function(req,res,next){
    const userid = req.body.userid;
    try{
        var findone = await bookMarkSchema.find({userId : userid});
        if(findone.length == 0){
            res.status(200).json({IsSuccess : true, Data : [], Message : "No Data Found"});
        }
        else{
            news_id = "";
            var news_wp;
            for(i=0;i<findone.length;i++){
                news_id += findone[i].newsId+ ",";

            }
            var da = news_id.slice(0,-1);
            var news_wp =  await request.post('http://www.thenationaldawn.in/wp-json/custom/bookmark',{form:{bookmark_news_id : "5621,5607"}}, function (error, response, body){
                // console.log(response.body);
                // news_wp = response.body;
            });
            var news_data = JSON.parse(news_wp);
            var final_data = news_data["Data"];
            res.status(200).json({ IsSuccess : true, Data : final_data, Message : "Data Found" });
        }
    }
    catch(err){
      res.status(500).json({ IsSuccess: false , Message: err.message });
    }
});

router.post("/newsbookmarkid", async function(req,res,next){
    const userid = req.body.id;
    try{
        var findone = await bookMarkSchema.find({userId : userid});
        if(findone.length == 0){
            res.status(200).json({IsSuccess : true, Data : 0, Message : "No Data Found"});
        }
        else{
            news_id = "";
            for(i=0;i<findone.length;i++){
                news_id += findone[i].newsId+ ",";
            }
            var da = news_id.slice(0,-1);
            res.status(200).json({IsSuccess : true, Data : da, Message : "Data Found"});
        }
    }
    catch(err){
      res.status(500).json({ IsSuccess: false , Message: err.message });
    }
});

module.exports = router;