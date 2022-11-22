const express = require('express')
const router = express.Router()
const authorController = require("../controllers/authorController")
const mailValidation = require("../middleware/mailValidation")
const blogController = require('../controllers/blogController')
const authMiddleWare = require("../middleware/auth")

//creating Author
router.post("/authors", mailValidation.validateEmail, authorController.createAuthor)

//creating blogs
router.post('/blogs',authMiddleWare.authenticateAuthor, blogController.createBlog)

//getting blogdata
router.get('/blogs',authMiddleWare.authenticateAuthor, blogController.getBlogs)

//updating blogdata
router.put('/blogs/:blogId', authMiddleWare.authenticateAuthor ,authMiddleWare.authoriseAuhtor, blogController.updateBlogs)

//deleting blogdata
router.delete('/blogs/:blogId', authMiddleWare.authenticateAuthor ,authMiddleWare.authoriseAuhtor, blogController.deleteBlogs)

//deleting blogdata using query
router.delete('/blogs',authMiddleWare.authenticateAuthor,authMiddleWare.authoriseAuthorfrmQuery, blogController.deleteBlogsUsingQuery)

//login author
router.post('/login', mailValidation.validateEmail , authorController.loginAuthor)

//some error path
router.all('/*',function(req,res){
    return res.status(400).send({status:false,msg:"Please give right path"})
})



module.exports = router


