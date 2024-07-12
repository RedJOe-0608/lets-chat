import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    sender: {
        type:String,
        required: true
    },
    //in 1:1 msg, this will be a user. in group msg, it will be group name.
    receiver: {
        type:String,
        required: true
    },
})

const conversationSchema = new mongoose.Schema({
    users: [{
        type: String,
        required: true
    }],
    messages: [messageSchema],
    groupName: {
        type: String,
    }
},{
    timestamps: true
})

const Conversation = mongoose.model('Conversation',conversationSchema)

export default Conversation