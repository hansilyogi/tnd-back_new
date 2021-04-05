var mongoose = require('mongoose');

var userBookMark = mongoose.Schema({
    userId : {
        type: mongoose.Types.ObjectId, ref: "UsersList", default: null 
    },       
    newsId : {
            type: String
        // type: mongoose.Types.ObjectId, ref: "NewsList", default: null
    },
    date : {
        type : String
    },
    time : {
        type: String
    },
    status : {
        type : Boolean,
        default : false,
    }
});

module.exports = mongoose.model("BookMark",userBookMark);