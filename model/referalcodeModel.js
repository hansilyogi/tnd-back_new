const mongoose = require("mongoose");

const referalcodeSchema = mongoose.Schema({
    referalcode: {
        type: String,
    },
    date :{
        type : String,
        default : new Date(),
    },
    Users: {
        type: mongoose.Types.ObjectId, 
        ref: "UsersList",
    },
});

module.exports = mongoose.model("BusinessCategory", referalcodeSchema);