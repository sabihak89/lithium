const authorModel = require('../models/authorModel')


//---------------------------------------------validating email--------------------------------------------------//

const validateEmail = async function (req, res, next) {
    try {
        let validMail = /^[A-Za-z0-9.]{2,}@[A-Za-z]{2,}[.]{1}[A-Za-z.]{2,3}$/
        let check = validMail.test(req.body.email)
        if (!check) {
            return res.status(400).send({ status: false, msg: "mail id is not valid" })
        }
        else {
            next()
        }
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

//--------------------------------------------------------------------------------------------------------------//

module.exports.validateEmail = validateEmail