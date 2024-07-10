import mongoose from "mongoose";

const groupMessageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: true
    },
    // not necessary to have receiver
    receiver: {
        type: String,
        required: true
    },
 
})

const groupConversationSchema = new mongoose.Schema({
    users: [{
        type: String,
        required: true
    }],
    groupName:{
            type: String,
            required: true
    },
    messages: [groupMessageSchema]
},{
    timestamps: true
})

const GroupConversation = mongoose.model('GroupConversation',groupConversationSchema)

export default GroupConversation