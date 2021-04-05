const mongoose = require("mongoose");

const businessCategorySchema = mongoose.Schema({
    categoryName: {
        type: String,
    },
    categoryImage: {
        type: String,
    },
    categoryIcon: {
        type: String,
        default: "https://res.cloudinary.com/dckj2yfap/image/upload/v1615366661/blog/newsPictures/lo-of-the-national-dawn-1_atelix.png",
    },
    dateTime: {
        type: Date,
        default: Date.now()
    },
    Users: {
        type: mongoose.Types.ObjectId,
        ref: "UsersList",
    },
});

module.exports = mongoose.model("BusinessCategory", businessCategorySchema);