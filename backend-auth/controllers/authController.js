import User from "../models/userModel.js";
import bcrypt from 'bcrypt'
import generateJWTAndSetCookie from "../utils/generateJWT.js";


const signup = async(req,res) => {
    try {
        const {username,password} = req.body
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const foundUser = await User.findOne({username})

        if(foundUser){
            res.status(201).json({message: 'Username already exists!'})
        }else{
            const user = new User({username,password:hashedPassword})
            console.log(user);
            await user.save()
            generateJWTAndSetCookie(user._id,res) //the server signs the jwt with the user._id as payload and JWT_SECRET and sends it back to the client in a cookie so that it automatically gets sent back in subsequent requests.
            
            res.status(201).json({message: `New user ${user._id} signed up successfully!` })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Sign up failed!' })
    }
}

export const signin = async(req, res)=>{
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});
        if(!user)
            return res.status(401).json({error: 'Auth failed'});
        const passwordMatch = await bcrypt.compare(password, user?.password || "");
        if(!passwordMatch)
            return res.status(401).json({error: 'Auth failed'});

        generateJWTAndSetCookie(user._id, res);
        
        console.log(`user ${user.username} with ${user._id} signed in successfully!`);
        
        res.status(200).json({
            _id: user._id,
            username: user.username
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: 'Login failed'});
    }}
 

export default signup