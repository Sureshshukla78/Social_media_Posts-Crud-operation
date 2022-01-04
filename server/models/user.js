const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    password: {
        type: String,
    },
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
userSchema.methods.generateAuthToken = async function(){
    try{
        console.log("Generating token")
        const token = jwt.sign({_id:this._id.toString()}, "Iwantthisinternshipsformylearning");
        this.tokens = this.tokens.concat({token});
        await this.save();
        console.log(token);
        return;
    }catch(error){
        console.log(`tokens error ${error}`);
    }
}

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("user", userSchema)