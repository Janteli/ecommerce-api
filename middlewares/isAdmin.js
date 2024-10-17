import User from "../model/User.model.js"

const isAdmin = async (req, res, next)=>{
    // finde the login user
    const user = await User.findById(req.userAuthId);

    if(user.isAdmin){
        next()
    }else{
        next(new Error('Access denied, admin only'))
    }
}

export default isAdmin;