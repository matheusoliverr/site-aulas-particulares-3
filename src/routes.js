const express = require('express')
const routes = express.Router()
const TeacherController = require('./app/controllers/teachers')
const StudentController = require('./app/controllers/students')

const TeacherValidator = require("./app/validators/teacher")
const StudentValidator = require("./app/validators/student")



routes.get("/", function(req,res){
    res.redirect("/teachers")
})

routes.get("/error", (req, res) =>{
    res.render("error")
})

routes.get("/teachers", TeacherValidator.table, TeacherController.table)
routes.get("/teachers/create", TeacherController.create)
routes.get("/teachers/:id", TeacherValidator.show, TeacherController.show)
routes.get("/teachers/:id/edit", TeacherValidator.edit, TeacherController.edit)
routes.put("/teachers", TeacherValidator.post, TeacherController.put)
routes.delete("/teachers", TeacherValidator.deleteTeacher, TeacherController.delete)
routes.post("/teachers", TeacherValidator.post, TeacherController.post)

routes.get("/students", StudentValidator.table, StudentController.table)
routes.get("/students/create", StudentController.create)
routes.get("/students/:id", StudentValidator.show, StudentController.show)
routes.get("/students/:id/edit", StudentController.edit)
routes.put("/students", StudentValidator.post, StudentController.put)
routes.delete("/students", StudentController.delete)
routes.post("/students", StudentValidator.post, StudentController.post)

module.exports = routes