const mongoose = require("mongoose");
const CustomerSchema = new mongoose.Schema({
    uid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    firstname:{
        type:String,
        required: true
    },
    lastname:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    address:{
        type:String
    },
    city:{
        type:String
    },
    state:{
        type:String
    },
    country:{
        type:String
    },
    pin:{
        type:String
    },
    mobile:{
        type:String
    },
    gender:{
        type:String
    },
    dob:{
        type:Date,
        default:Date.now()
    },
    tags:{
        type:String
    },
    dateadded:{
        type:Date,
        default:Date.now()
    },
    source:{
        type:String
    },
    emc:{
        type:Boolean
    },
    smc:{
        type:Boolean
    },
    product:{
        type: new mongoose.Schema({
            total: {type: String,default: 0},
            last_purchase: {type: String,default: 0}
        })
    }

});
module.exports = mongoose.model("Customer",CustomerSchema);