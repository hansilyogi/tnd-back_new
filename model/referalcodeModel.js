const mongoose = require("mongoose");

const referalcodeSchema = mongoose.Schema({
    referalcode: {
        type: String,
        required: true,
    },
    date :{
        type : String,
        default : new Date(),
    },
    Userid: {
        type: mongoose.Types.ObjectId,
        ref: "UsersList",
        required : true,
    },
    usedby : [
        {
            type: mongoose.Types.ObjectId,
            ref: "UsersList",
        }
    ]
});

module.exports = mongoose.model("Referalcode", referalcodeSchema);