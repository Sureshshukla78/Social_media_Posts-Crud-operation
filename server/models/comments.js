const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const commentSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    comment: {
        type: String,
    },
    tokens: {
        type: [{
            token:{
                type: String,
            }
        }]
    },
}, {
    timestamps: true
}
);
commentSchema.methods.generateCommentToken = async function(){
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
module.exports = mongoose.model("comment", commentSchema)