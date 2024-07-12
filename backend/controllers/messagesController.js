import Conversation from "../models/chatModel.js";


export const addMsgToConversation = async (participants, groupName,msg) => {
   try {

    let conversation = null

    if(groupName)
    {
        conversation = await Conversation.findOne({groupName: groupName})
    }
    else
    {
        // Find conversation by participants
     //    $all is a MongoDB query operator that matches arrays that contain all elements specified in the query. This means it checks if the users array in the Conversation document contains all the elements in the participants array.
    
         conversation = await Conversation.findOne(
                                    { users: { $all: participants },groupName:"" });
    }
       // If conversation doesn't exist, create a new one
       if (!conversation) {
           conversation = await Conversation.create({ users: participants,groupName:groupName });
       }
       // Add msg to the conversation
       if(msg)
         conversation.messages.push(msg);
         await conversation.save();
   } catch (error) {
       console.log('Error adding message to conversation: ' + error.message);
   }
};

// Get messages for a conversation identified by participants, or groupName for group chat
const getMessagesForConversation = async (req, res) => {
    try {
        const { participants,groupName } = req.query;
        console.log("Participants are: ",participants);
        console.log("group is",groupName);

        let conversation = null

        if(groupName)
        {
            conversation = await Conversation.findOne({groupName: groupName})
        }
        else
        {
            // Find conversation by participants
            conversation = await Conversation.findOne({ users: { $all: participants },groupName: ""});
        }
        if (!conversation) {
            console.log('Conversation not found');
            return res.status(200).send();
        }
        console.log(conversation.messages);
        return res.json(conversation.messages);
 
    } catch (error) {
        console.log('Error fetching messages:', error);
        res.status(500).json({ error: 'Server error' });
    }
 };

 export const getMyGroups = async(req,res) => {
    try {
        const {username} = req.query
        const groupNames = await Conversation.find({users:username,groupName: { $ne: "" } })
        res.status(200).json(groupNames)
    } catch (error) {
        console.log('Error fetching group names:', error);
        res.status(500).json({ error: 'Error fetching group names:' });
    }
}


 export default getMessagesForConversation;