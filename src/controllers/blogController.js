const blogModel = require('../models/blogsModel')
const authorModel = require('../models/authorModel')
const { isValidObjectId } = require('mongoose')


//-------------------------------------------------VALIDATION--------------------------------------------------//

const isValid = function (value) { // function for title and body validation

    if (typeof value == 'undefined' || value == 'null')
        return false
    if (typeof value == 'string' && value.trim().length >= 1)
        return true
}

const isvalidtagsandsubcat = function (value) { // function for tags and subcategory validation
    if (typeof value == 'undefined' || value == 'null')
        return false
    if (typeof value == 'object')
        return true
}

//--------------------------------------------------------------------------------------------------------------//




//-----------------------------------------------CREATING BLOGS--------------------------------------------------//

const createBlog = async function (req, res) {
    const { title, body, authorId, tags, category, subcategory, isPublished, isDeleted } = req.body
    try {
        if (!title || !body || !authorId || !category) {
            return res.status(400).send({ status: false, msg: "all fields are required" })
        }
        // title validation
        if (!isValid(title)) {
            return res.status(400).send({ status: false, msg: "title is invalid! (please take title in string)" })
        }
        // body validation
        if (!isValid(body)) {
            return res.status(400).send({ status: false, msg: "body is invalid! (please take body in string)" })
        }
        // category validation
        if (!isValid(category)) {
            return res.status(400).send({ status: false, msg: "category is invalid! (please take category in string)" })
        }
        // tags validation
        if (!isvalidtagsandsubcat(tags)) {
            return res.status(400).send({ status: false, msg: "tags is invalid! (please take tags in array of string)" })
        }
        // subcategory validation
        if (!isvalidtagsandsubcat(subcategory)) {
            return res.status(400).send({ status: false, msg: "subcategory is required or invalid! (please take subcategory in array of string)" })
        }
        // authorId validation
        if (!isValidObjectId(authorId)) {
            return res.status(400).send({ status: false, msg: "invalid authorid in validation" })
        }
        const authorDetail = await authorModel.findById(authorId)
        if (!authorDetail) {
            return res.status(400).send({ status: false, msg: "invalid authorid" })
        }
        const data = await blogModel.create({ title, body, authorId, tags, category, subcategory, isPublished, isDeleted })
        return res.status(201).send({ status: true, data: "succesfully created data", data })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

//-------------------------------------------------------------------------------------------------------------------//



//-----------------------------------------------------GET BLOGS-----------------------------------------------------//

const getBlogs = async function (req, res) {
    try {
        let queryData = req.query        // receving data from query

        if (queryData.category == "") {
            return res.status(400).send({ status: false, msg: "please provide some data in category field!" })
        }

        if (queryData.title == "") {
            return res.status(400).send({ status: false, msg: "please provide some data in title field!" })
        }

        if (queryData.body == "") {
            return res.status(400).send({ status: false, msg: "please provide some data in body field!" })
        }

        queryData["iPublished"] = true   // adding isPublished in queryData
        queryData["isDeleted"] = false   // adding isPublished in queryData


        let authorId = req.query.authorId  // if we are sending authorID in query 

        if (authorId == "") {              // if we are not sending authorID in query(value)
            return res.status(400).send({ status: false, msg: "please provide an authorId in authorId field!" });
        }

        if (authorId && !isValidObjectId(authorId)) {    // validating the authorId
            return res.status(400).send({ status: false, msg: "please enter valid authorId" });
        }

        const data = await blogModel.find(queryData);    // finding querydata with isPublished true and IsDeleted false.

        if (data.length == 0) {
            return res.status(404).send({ status: false, msg: "No data found!" })
        }

        return res.status(200).send({ status: true, data: data })

    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
};

//----------------------------------------------------------------------------------------------------------------------//



//-------------------------------------------------UPDATING BLOG-------------------------------------------------------//

const updateBlogs = async function (req, res) {
    try {
        const blogId = req.params.blogId // blogId check

        // checking blogId is coming or not
        if (!blogId) {
            return res.status(400).send({ status: false, msg: "BlogId is required" })
        }
        const blogDetails = await blogModel.findById(blogId)
        // checking blogdata is coming from db or not
        if (!blogDetails) {
            return res.status(404).send({ status: false, msg: "blogDetails not found" })
        }
        if (blogDetails._id != blogId) {
            return res.status(404).send({ status: false, msg: "blogDetails not found" })
        }
        if (blogDetails.isDeleted == true) {
            return res.status(404).send({ status: false, msg: "blog details is deleted" })
        }
        const updateData = await blogModel.findByIdAndUpdate(
            { _id: blogId },
            {
                $set: {
                    title: req.body.title,
                    body: req.body.body,
                    isPublished: req.body.isPublished, publishedAt: new Date()

                },
                $push: {
                    tags: req.body.tags,
                    subcategory: req.body.subcategory,
                }
            },
            { new: true, upsert: true }
        )
        return res.status(200).send({ status: true, msg: "data succesfully created", data: updateData })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

//-----------------------------------------------------------------------------------------------------------------------//



//----------------------------------------------DELETING BLOGS USING PATH PARAMS-----------------------------------------//

const deleteBlogs = async function (req, res) {
    try {
        const blogId = req.params.blogId
        // checking blogId is coming or not
        if (!blogId) {
            return res.status(400).send({ status: false, msg: "blogId is required." })
        }
        const blogDetails = await blogModel.findById(blogId)

        // checking blogdata is coming from db or not
        if (!blogDetails) {
            return res.status(404).send({ status: false, msg: "No data found!" })
        }
        if (blogDetails._id != blogId) {
            return res.status(404).send({ status: false, msg: "blogDetail is not present" })
        }
        if (blogDetails.isDeleted == true) {
            return res.status(404).send({ status: false, msg: "blogDetails is already deleted" })
        }
        const deleteData = await blogModel.updateOne({ _id: blogId }, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })
        return res.status(200).send({ status: true, msg: "data deleted succesfully", })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

//--------------------------------------------------------------------------------------------------------------------------------------//



//----------------------------------------------------DELETING BLOGS USING QUERY PARAMS--------------------------------------------------//

const deleteBlogsUsingQuery = async function (req, res) {
    try {
        const queryData = req.query

        // checking data is coming from query 
        if (Object.keys(queryData).length == 0) {
            return res.status(400).send({ status: false, msg: "enter some data in query" })
        }

        const alldata = await blogModel.find({ $and: [queryData, { isDeleted: false }, { isPublished: true }] })

        if (alldata.isDeleted == true || alldata.length == 0) {
            return res.status(404).send({ status: false, msg: "Blog is already deleted" })
        }

        if (!alldata) {
            return res.status(400).send({ status: false, msg: "no data with this query" })
        } else {
            const deleteData = await blogModel.updateMany(queryData, { $set: { isDeleted: true, deletedAt: new Date(), isPublished: false } }, { new: true })

            return res.status(200).send({ status: true, msg: "data succesfully deleted" })
        }
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

//-------------------------------------------------------------------------------------------------------------------//




module.exports.createBlog = createBlog
module.exports.getBlogs = getBlogs
module.exports.updateBlogs = updateBlogs
module.exports.deleteBlogs = deleteBlogs
module.exports.deleteBlogsUsingQuery = deleteBlogsUsingQuery
