const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ["ignored", "accepted", "rejected", "interested"],
            message: `{VALUE} is not a valid status type`
        },
        required: true
    }

},
    {
        timestamps: true
    }
);

//Compound Indexes
connectionRequestSchema.index({fromUserId:1, toUserId:1});

//before save() always this pre method will be called if fromUsedId !== toUserId
connectionRequestSchema.pre("save", function(){
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error (" You Can't send  connection request to yourself !! ")
    }
    next();
})

const connectionRequestModel = new mongoose.model("connectionRequest",connectionRequestSchema);
module.exports = connectionRequestModel;