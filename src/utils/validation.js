const validator = require('validator')

const validateSignupData = (req) =>{
    const {firstName,lastName,emailId,password} = req.body;

    if(!firstName || !lastName)
    throw new Error('firstName and lastName is required');
    else if(!validator.isEmail(emailId))
    throw new Error('Invalid email address');
    else if(!validator.isStrongPassword(password))
    throw new Error('Please enter Strong Password')

}

module.exports = {
    validateSignupData
}