const mongoose = require("mongoose");
const Comments = require("./comments")
const jwt = require("jsonwebtoken");
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
    ],
    tokens: {
        type: [{
            token:{
                type: String,
            }
        }]
    }
}, {
    timestamps: true
}
);
// generating tokens
postSchema.methods.generatePostToken = async function(){
    try{
        console.log("Generating token")
        const token = jwt.sign({_id:this._id.toString()}, "Iwantthisinternshipsformylearning");
        this.tokens = this.tokens.concat({token});
        await this.save();
        console.log(`This is Post token ${token}`);
        return;
    }catch(error){
        console.log(`tokens error ${error}`);
    }
}

module.exports = mongoose.model("post", postSchema)