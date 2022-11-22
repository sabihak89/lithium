const jwt = require('jsonwebtoken')
const { isValidObjectId } = require('mongoose')
const blogsModel = require('../models/blogsModel')

//---------------------------------------------AUTHENTICATING AUTHOR--------------------------------------------------//

const authenticateAuthor = async function (req, res, next) {
    const token = req.headers['x-api-key']
    try {
        if (!token) {
            return res.status(400).send({ status: false, msg: "token is required" })
        }
        const decodeToken = jwt.verify(token, 'projectsecretcode', function (err, decodeToken) {
            if (err) {
                return res.status(401).send({ status: false, msg: "token invalid" })
            }
            else {
                req.token = decodeToken
                next()
            }
        })
    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}

//---------------------------------------------------------------------------------------------------------------------//


//---------------------------------------------AUTHORIZE AUTHOR--------------------------------------------------//

const authoriseAuhtor = async function (req, res, next) {
    try {
        const blogId = req.params.blogId
        if (!isValidObjectId(blogId)) {
            return res.status(400).send({ status: false, msg: "invalid blogId" })
        }
        const blogData = await blogsModel.findById(blogId)
        if (!blogData) {
            return res.status(400).send({ status: false, msg: "Provide valid blogId" })
        }
        let authorId = blogData.authorId
        let authorIdFromDT = req.token.authorId
        if (authorId != authorIdFromDT) {
            return res.status(403).send({ status: false, msg: "access denied" })
        }
        next()
    }
    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}

//---------------------------------------------------------------------------------------------------------------//



//---------------------------------------------AUTHORIZING AUTHOR FROM QUERY--------------------------------------------------//

const authoriseAuthorfrmQuery = async function (req, res, next) {
    try {
        const queryData = req.query
        const queryDoc = await blogsModel.find(queryData)
        if (queryDoc.length == 0) {
            return res.status(404).send({ status: false, msg: "data not found!" })
        }
        for (let i = 0; i < queryDoc.length; i++) {
            let elem = queryDoc[i]
            let authorId = elem.authorId.toString()
            if (authorId !== req.token.authorId) {
                return res.status(403).send({ status: false, msg: "access denied!!" })
            } else {
                next()
            }
        }
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

//------------------------------------------------------------------------------------------------------------------//

module.exports.authenticateAuthor = authenticateAuthor
module.exports.authoriseAuhtor = authoriseAuhtor
module.exports.authoriseAuthorfrmQuery = authoriseAuthorfrmQuery