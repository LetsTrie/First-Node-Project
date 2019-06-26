const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userID: {
        type: String
    },
    username: {
        type: String,
    },
    userPropicURL: {
        type: String,
    },
    postTitle: {
        type: String,
        required: true,
        min: 6
    },
    postContent: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model("blogs", userSchema);