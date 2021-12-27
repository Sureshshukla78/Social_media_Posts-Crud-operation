const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    comment: {
        type: String,
    },
}, {
    timestamps: true
}
);

module.exports = mongoose.model("comment", commentSchema)