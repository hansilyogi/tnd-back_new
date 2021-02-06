var mongoose = require('mongoose');

var newsCategorySchema = mongoose.Schema({
    newsType: {
        type:String,
        require: true
    },
    newsDate: {
        type:Date,
        default: Date.now
    },
    categoryImage: {
        type:String
    },
    priority :{
        type : Number
    }
});

module.exports = mongoose.model("NewsCategory",newsCategorySchema);