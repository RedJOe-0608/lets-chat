import GroupConversation from "../models/groupChatModel.js";

export const getGroupConversations = async(req,res) => {
    
    try {
        const {groupName} = req.body
    let groupMessages = await GroupConversation.findOne({groupName: groupName})

    if(!groupMessages)
    {
        return res.status(200).json({message: "Conversation not found!"})
    }
    return res.json(groupMessages.messages)

    } catch (error) {
        console.log('Error fetching messages:', error);
        res.status(500).json({ error: 'Error fetching messages:' });
    }
}

export const getGroupNames = async(req,res) => {
    try {
        const groupNames = await GroupConversation.find({},'groupName')
        res.status(200).json(groupNames)
    } catch (error) {
        console.log('Error fetching group names:', error);
        res.status(500).json({ error: 'Error fetching group names:' });
    }
}

export const createGroupConversation = async(groupName,participants) => {
    
    //if group does not exist, create it. else, do nothing
    try {
        let newGropConversation = await GroupConversation.findOne({groupName: groupName})

        if(!newGropConversation)
        {
             newGropConversation = await GroupConversation.create(
            {
                groupName: groupName,
                users: participants,
                messages: []
            })
            await newGropConversation.save()
            console.log(`Group with name ${groupName} successfully created!`);
            console.log(`Participants are: ${participants}`);
        }else{
           console.log(`Group with name ${groupName} exists. You can join the group.`);
        }

    } catch (error) {
        console.log('Error creating new group: ' + error.message);
    }
}

export const addMsgToGroupConversation = async (groupName,message) => {
    try {
        // Find groupConversation by groupName
        let groupConversation = await GroupConversation.findOne({groupName: groupName});

        // Add msg to the groupConversation
        groupConversation.messages.push(message);
          await groupConversation.save();
    } catch (error) {
        console.log('Error adding message to group conversation: ' + error.message);
    }
 };
 