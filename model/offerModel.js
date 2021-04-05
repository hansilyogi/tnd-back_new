const mongoose = require("mongoose");

const offerSchema = mongoose.Schema({
    title: {
        type: String,
    },
    bannerImage: {
        type: String,
    },
    userId : {
        type: mongoose.Types.ObjectId, ref: "UsersList",
    },
    city :{
        type: mongoose.Types.ObjectId, ref: "city",
    },
    dateTime: {
        type: String,
    },
    type:{
        type: String,
    },
    details: {
        type: String,
    },
    redeemBy: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    businessCategory: {
        type: mongoose.Types.ObjectId, ref: "BusinessCategory",
    },
    offerExpire: {
        type: String
    },
    daysRemain: {
        type: String
    },
    faceBook : {
        type: String,
        default : ""
    },
    instagram : {
        type: String,
        default : ""
    },
    linkedIn : {
        type: String,
        default: ""
    },
    twitter : {
        type: String,
        default: ""
    },
    whatsApp : {
        type: String,
        default: ""
    },
    youTube : {
        type: String,
        default: ""
    },
    mail : {
        type : String,
        default : "",
    }
});

module.exports = mongoose.model("offer", offerSchema);