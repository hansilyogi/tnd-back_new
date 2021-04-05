const mongoose = require("mongoose");

const citySchema = mongoose.Schema({

    City : {
        type : String
    }
});

module.exports = mongoose.model("city", citySchema);