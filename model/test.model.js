var mongoose = require('mongoose');
Schema = mongoose.Schema;

var newSchema = mongoose.Schema({
    name: { 
        type: String,
        require: true,
    },
    email: { 
        type: String,
        require: true,
    },
    mobile: { 
        type: String,
        unique: true,
        require: true, 
    },
    company_name: { 
        type: String,
        default: "",
    },
    companylogo : {
        type:String,
        default :"https://res.cloudinary.com/dckj2yfap/image/upload/v1610557322/blog/users/2021-01-13T17:02:02.133Z.jpg"
    },
    refralcode : {
        type : String
    },
    company_website : {
        type : String,
        default : "",
    },
    referred_by: {
        type: String,
        default: "", 
    },
    ismember : {
        type : Boolean,
        default : false
    },
    date_of_birth : { 
        type: String,
        default: "",
    },
    gender : { 
        type: String,
        default: "", 
    },
    address : { 
        type: String,
        default: "", 
    },
    spouse_name : { 
        type: String,
        default: "", 
    },
    spouse_birth_date : { 
        type: String,
        default: "",
    },
    number_of_child : { 
        type: Number,
        default: 0, 
    },
    img : { 
        type: String,
        // default: "uploads/users/default-profile.png",
        default : "https://res.cloudinary.com/dckj2yfap/image/upload/v1610557322/blog/users/2021-01-13T17:02:02.133Z.jpg" 
    },
    memberOf : [{ 
        type: mongoose.Types.ObjectId,
        ref: "MemberShip", 
        // default : mongoose.Types.ObjectId('5fc763fae47d7d695ca827fc'),
    }],
    member_id : [{
        type: mongoose.Types.ObjectId,
        ref: "MemberShip", 
    }],
    business_category : { 
        type: mongoose.Types.ObjectId,
        ref: "BusinessCategory",
    },
    business_id : {
        type: mongoose.Types.ObjectId,
        ref: "BusinessCategory",
    },
    experience : { 
        type:String,
        default: ""
    },
    about_business : { 
        type:String,
        default: ""
    },
    achievement : { 
        type:String,
        default: ""
    },
    status : { 
        type: String,
        default: 'send',
    },
    keyword : {
        type : String,
        default : ""
    },
    fcmToken : { 
        type: String,
        default: ""
    },
    isVerified : {
        type: Boolean,
        default: false,
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
    count :{
        type : Number,
        default : 0,
    },
    favoraitenewsnotification :[{
        type : String
    }]
});

module.exports = mongoose.model("UsersList",newSchema);