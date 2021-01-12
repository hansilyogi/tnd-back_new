var mongoose = require('mongoose');

var connectionSchema = mongoose.Schema({
    requestSender : {
        type: mongoose.Types.ObjectId, ref: "UsersList", default: null 
    },       
    requestReceiver : {
        type: mongoose.Types.ObjectId, ref: "UsersList", default: null
    },
    requestStatus : {
        type: String,
        default: "requested"
    },
    notification : {
        notificationBody : {
            type: String,
            default: " "
        },
        notificationTitle : {
            type: String,
            default: " "
        },
    },
    meetingType : {
        type: String,
    },
    meetingLink : {
        type: String,
        default: " "
    },
    date : {
        type : String,
    },
    time : {
        type: String,
    },
    topic : {
        type : String,
        default : "",
    },
    generatedRefral :{
        type : String,
    }
});

module.exports = mongoose.model("connectionModel",connectionSchema);