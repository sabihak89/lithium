const mongoose = require('mongoose')

const authorSchema = new mongoose.Schema({
    "fname": {
        type: String,
        required: true,
        trim : true
    },
    "lname": {
        type: String,
        required: true,
        trim : true
    },
    "title": {
        type: String,
        enum: ["Mr", "Mrs", "Miss"],
        trim : true
    },
    "email": {
        type: String,
        required: true,
        unique: true,
        trim : true,
        //lowercase : true
    },
    "password": {
        type: String,
        required: true
    },
    "isDeleted": {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('author', authorSchema)