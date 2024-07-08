import User from "../models/userModel.js";

const getUsers = async(req,res) => {
    
    try {
        // User.find({}): This part of the command finds all documents in the User collection.
        // 'username': This specifies that only the username field should be returned for each document.
        const users = await User.find({},'username')
        res.status(200).json(users)
    } catch (error) {
       console.log(error.message);	
       res.status(500).json({ message: 'Server Error' });
    }
}

export default getUsers