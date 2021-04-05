const mongoose = require("mongoose");
const epaperSchema = mongoose.Schema({

    title: {
        type: String,
    },
    date : {
        type: String
    },
    pdfUrl: {
        type: String,
    },
    image: {
        type: String
    }
});

module.exports = mongoose.model('epaper', epaperSchema)