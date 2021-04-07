const mongoose = require("mongoose");

const SubCategorySchema = mongoose.Schema({
    CategoryName : {
        type : String
    },
    Mastercategory: {
        type: mongoose.Types.ObjectId, ref: "MasterCategory", require: true
    },
});

module.exports = mongoose.model("SubCategory", SubCategorySchema);