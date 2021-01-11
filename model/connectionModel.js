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
        default : new Date(),
    }
});

module.exports = mongoose.model("connectionModel",connectionSchema);