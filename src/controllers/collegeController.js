const internModel = require('../models/internModel')
const collegeModel = require('../models/collegeModel')

let createCollege = async function (req, res) {
    try {
        if (req.body && Object.keys(req.body).length > 0) {
            let college = await collegeModel.create(req.body)
            res.status(201).send({ status: true, data: college })
        } else {
            //handles null/undefined/empty request body
            res.status(400).send({ status: false, msg: 'Request must contain a valid body' })
        }
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

let collegeDetails = async function (req, res) {
    try {
        res.setHeader('Access-Control-Allow-Origin','*')
        if (req.query.collegeName) {
            let college = await collegeModel.findOne({name: req.query.collegeName, isDeleted: false})
            if(!college) {
                res.status(404).send({ status: false, msg: 'College not found for the requested collegeName' })
            } else {
                let collegeData = {
                    name: college.name,
                    fullName: college.fullName,
                    logoLink:  college.logoLink
                }
                let interns = await internModel.find({collegeId: college._id, isDeleted: false}, '-collegeId -isDeleted -createdAt -updatedAt -__v').sort({createdAt: -1})
                if(interns) {
                    collegeData.interns = interns
                }
                res.status(201).send({ status: true, data: collegeData })
            }
        } else {
            res.status(400).send({ status: false, msg: "CollegeName must be present in the request parameters" })
        }
    } catch (err) {
        res.status(500).send({ staus: false, msg: err.message })
    }
}

module.exports.createCollege = createCollege
module.exports.collegeDetails = collegeDetails