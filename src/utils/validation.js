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

const validateEditData = (req) =>{
    const editablePool = ["firstName","lastName","age","gender","about","skills","photoUrl"];
    const isEditAllowed = Object.keys(req.body).every(key => editablePool.includes(key));

    if(!isEditAllowed)
    throw new Error('Not allowed to Edit')
}

module.exports = {
    validateSignupData,
    validateEditData
}