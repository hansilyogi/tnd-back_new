const mongoose = require("mongoose");

const masterCategorySchema = mongoose.Schema({
    CategoryName : {
        type : String
    }
});

module.exports = mongoose.model("MasterCategory", masterCategorySchema);