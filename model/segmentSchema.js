const mongoose = require("mongoose");
const SegmentSchema = new mongoose.Schema({
    uid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    segmentValue: {
        type: [],
        default: []
    },
    segmentName: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Segment", SegmentSchema);
