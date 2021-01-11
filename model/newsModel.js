var mongoose = require('mongoose');

var newsModelSchema = mongoose.Schema({
    newsType: {
        type: mongoose.Types.ObjectId, ref: "NewsCategory", require: true
    },
    content: {type:String},
    newsDate: {
        type:String,
    },
    newsTime: {
        type: String,
    },
    headline: {
        type:String,
        require: true
    },
    newsImage: {
        type:String
    },
    newsImage2: {
        type:String
    },
    newsImage3: {
        type:String
    },
    newsImage4: {
        type:String
    },
    newsImage5: {
        type:String
    },
    newsImage6: {
        type:String
    },
    newsImage7: {
        type:String
    },
    newsImage8: {
        type:String
    },
    newsImage9: {
        type:String
    },
    newsImage10: {
        type:String
    },
    newsvideo : {
        type : String
    },
    newsAudio : {
        type : String
    },
    trending: {
        type: Boolean,
        default: false
    },
    bookmark: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("NewsList",newsModelSchema);