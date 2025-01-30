const mongoose = require('mongoose');
const ViewLaterSchema = mongoose.Schema({
    coursename: {
        type: String,
    },
    subjectname: {
        type: String,
    },
    unitname: {
        type: String,
    },
    materialname: {
        type: String,
    }

})