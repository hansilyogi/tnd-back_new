const mongoose = require("mongoose");

const inquirySchema = mongoose.Schema({

    name : {
        type: String,
    },
    email : {
        type: String,
    },
    mobile : {
        type: String,
    },
    description : {
        type: String,
    },
    status : {
        type : Boolean,
        default : false,
    }
});

module.exports = mongoose.model("inquiry", inquirySchema);