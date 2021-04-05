var mongoose = require('mongoose');

var bussModelSchema = mongoose.Schema({
    categoryType: {
        type: mongoose.Types.ObjectId, ref: "Business_storiesCategory", require: true
    },
    content: {type:String},
    BusDate: {
        type:String,
    },
    BusTime: {
        type: String,
    },
    headline: {
        type:String,
        require: true
    },
    bussImage: {
        type:String
    },
    bussImage2: {
        type:String
    },
    bussImage3: {
        type:String
    },
    bussImage4: {
        type:String
    },
    bussImage5: {
        type:String
    },
    bussImage6: {
        type:String
    },
    bussImage7: {
        type:String
    },
    bussImage8: {
        type:String
    },
    bussImage9: {
        type:String
    },
    bussImage10: {
        type:String
    },
    bussvideo : {
        type : String
    },
    bussAudio : {
        type : String
    },
});

module.exports = mongoose.model("Business_storyList",bussModelSchema);