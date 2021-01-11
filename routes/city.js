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
const testModel = require('../model/test.model');
var axios = require("axios");
var citymodel = require('../model/cityModel');

router.post("/addCity" , async function(req,res,next){
    const City = req.body.city;
    try {
        var record = await new citymodel({
            City: City
        });
        if(record){
            await record.save();
            res.status(200).json({ IsSuccess: true , Data: [record] , Message: "City Added" });
        }
        else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "Not Added" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/getCity" , async function(req,res,next){
    try {
        var record = await citymodel.find();
        if(record){
            res.status(200).json({ IsSuccess: true , Data: record , Message: "Cities Found" });
        }
        else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "No Cities Available" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

module.exports = router;