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
    },
    byUser : {
        type: mongoose.Types.ObjectId, ref: "UsersList",
    },
    toUser : {
        type: mongoose.Types.ObjectId, ref: "UsersList",
    }
});

module.exports = mongoose.model("inquiry", inquirySchema);