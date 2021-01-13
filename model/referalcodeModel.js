const mongoose = require("mongoose");

function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
};

function getRandomString(length) {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for ( var i = 0; i < length; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}

const referalcodeSchema = mongoose.Schema({
    referalcode: {
        type: String,
        default : getRandomString(6),
    },
    date :{
        type : String,
        default : new Date(),
    },
    Userid: {
        type: mongoose.Types.ObjectId,
        ref: "UsersList",
    },
});

module.exports = mongoose.model("Referalcode", referalcodeSchema);