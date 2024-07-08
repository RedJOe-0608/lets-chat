import jwt from 'jsonwebtoken'

const verifyToken = (req,res,next) => {

    //get token from cookie
    const token = req.cookies.jwt;

    if(!token){
        return res.status(401).json({message:'Unauthorized! No token provided.'})
    }

    try {
        //verify token
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        next()
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' })
    }


}

export default verifyToken