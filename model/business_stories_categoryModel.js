var mongoose = require('mongoose');

var business_storiesCategorySchema = mongoose.Schema({
    categoryType: {
        type:String,
        require: true
    },
    initdate: {
        type:Date,
        default: Date.now
    },
    categoryImage: {
        type:String
    }
});

module.exports = mongoose.model("Business_storiesCategory",business_storiesCategorySchema);