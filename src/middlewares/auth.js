const jwt = require('jsonwebtoken');
const User = require('../models/user')

const userAuth = async (req,res,next) => {

    try {
        const { token } = req.cookies;
        if (!token)
        throw new Error('Token not provided!!!');

        const decodedToken = await jwt.verify(token, 'JWT');
        const { _id } = decodedToken;
        const user = await User.findById(_id);

        if (!user)
        throw new Error('Invalid Token');

        req.user = user;
        next();

    } catch (error) {
        res.status(400).send('Error : ' + error.message)
    }
}

module.exports ={
    userAuth
}