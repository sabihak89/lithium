const authorModel = require('../models/authorModel')
const jwt = require('jsonwebtoken')

//---------------------------------------------VALIDATION--------------------------------------------------//

const isValid = function (value) { // function for name validation

    if (typeof value == 'undefined' || value == 'null')
        return false
    let nameCheck = /^[a-zA-Z]+$/.test(value)
    if (nameCheck == false) {
        return false
    }
    if (typeof value == 'string' && value.trim().length >= 1)
        return true

}


const isValidpass = function (value) { // function for password validation

    if (typeof value == 'undefined' || value == 'null')
        return false
    let nameCheck = /^[a-zA-Z0-9@#!$%^&*_-]{3,10}$/.test(value)
    if (nameCheck == false) {
        return false
    }
    if (typeof value == 'string' && value.trim().length >= 1)
        return true

}

//--------------------------------------------------------------------------------------------------------------//




//----------------------------------------------CREATING AUTHOR-------------------------------------------------//

const createAuthor = async function (req, res) {
    const { fname, lname, title, email, password } = req.body
    try {
        if (!fname || !lname || !title || !email || !password) {
            return res.status(400).send({ status: false, msg: "all field is required" })
        }
        // making mail unique
        const CheckMail = await authorModel.findOne({ email: email })
        if (CheckMail) {
            return res.status(400).send({ status: false, msg: "mail is already exist." })
        }
        // enum validating
        const enumTitle = ["Mr", "Mrs", "Miss"]
        if (!enumTitle.includes(title)) {
            return res.status(400).send({ status: false, msg: "Please use 'Mr','Mrs','Miss' " })
        }
        // fname validation 
        if (!isValid(fname)) {
            return res.status(400).send({ status: false, msg: "Please provide a valid fname." })
        }
        // lname validation
        if (!isValid(lname)) {
            return res.status(400).send({ status: false, msg: "Please provide a valid lname." })
        }
        // password validation
        if (!isValidpass(password)) {
            return res.status(400).send({ status: false, msg: "Please provide a valid password." })
        }

        else {
            const data = await authorModel.create({ fname, lname, title, email, password })
            return res.status(201).send({ status: true, data: "data created succesfully", data })
        }
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

//----------------------------------------------------------------------------------------------------------//



//---------------------------------------------LOGIN AUTHOR--------------------------------------------------//

const loginAuthor = async function (req, res) {
    const { email, password } = req.body
    try {
        if (!email || !password) {
            return res.status(400).send({ status: false, msg: "mail id or password is required" })
        }
         // password validation
         if (!isValidpass(password)) {
            return res.status(400).send({ status: false, msg: "Please provide a valid password." })
        }
        const authorData = await authorModel.findOne({ email: email, password: password })
        if (!authorData) {
            return res.status(400).send({ status: false, msg: "incorrect email or password" })
        }
        const token = jwt.sign({ authorId: authorData._id.toString() }, "projectsecretcode")
        return res.status(200).send({ status: true, msg: "succesfull logged in", token })
    }
    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}

//-------------------------------------------------------------------------------------------------------------//

module.exports.createAuthor = createAuthor
module.exports.loginAuthor = loginAuthor