const mongoose = require("mongoose");

const eventRegisterSchema = mongoose.Schema({

    userid : {
        type: mongoose.Types.ObjectId, ref: "UsersList",
    },
    eventid : {
        type: mongoose.Types.ObjectId, ref: "Events",
    }
});

module.exports = mongoose.model("eventregister", eventRegisterSchema);