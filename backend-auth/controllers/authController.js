import User from "../models/userModel.js";
import bcrypt from 'bcrypt'
const signup = async(req,res) => {
    try {
        const {username,password} = req.body
        const hashedPassword = await bcrypt.hash(password,10)

        const foundUser = await User.findOne({username})

        if(foundUser){
            res.status(201).json({message: 'Username already exists!'})
        }else{
            const user = new User({username,password:hashedPassword})
            console.log(user);
            await user.save()
            res.status(201).json({message: `New user ${user._id} signed up successfully!` })
        }
    } catch (error) {
        console.log(error);
        res.status(201).json({message: 'Sign up failed!' })
    }
}

export default signup