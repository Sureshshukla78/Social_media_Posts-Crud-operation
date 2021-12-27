const mongoose = require("mongoose");
const Comments = require("./comments")
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        max: 500,
    },
    img: {
        type: String,
    },
    likes: {
        type: Array,
        default: []
    },
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: Comments
        }
    ]
}, {
    timestamps: true
}
);
module.exports = mongoose.model("post", postSchema)