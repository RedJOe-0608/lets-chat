import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
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

const conversationSchema = new mongoose.Schema({
    users: [{
        type: String,
        required: true
    }],
    messages: [messageSchema]
},{
    timestamps: true
})

const Conversation = mongoose.model('Conversation',conversationSchema)

export default Conversation