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
        type:String,
        default : "https://res.cloudinary.com/dckj2yfap/image/upload/v1610557322/blog/users/2021-01-13T17:02:02.133Z.jpg",
    },
    priority :{
        type : Number
    }
});

module.exports = mongoose.model("NewsCategory",newsCategorySchema);