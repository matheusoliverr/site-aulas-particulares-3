const Student = require('../models/Student')
const Teacher = require('../models/Teacher')
const { age, date, formatGrade } = require("../../lib/utils")

function post(req, res, next){
    try {
        const keys = Object.keys(req.body)

        for(key of keys){
            if(req.body[key] == "") return res.render("study/create", {
                student: req.body,
                error: "Preencha todos os campos"
            })
        }

        formattedBirth = Date.parse(req.body.birth)
        req.body.birth = date(formattedBirth).iso

        next()
    } catch (error) {
        console.error(error);
    }
    
}

async function table(req, res, next){
    try {
        let { filter, page, limit } = req.query

        page = page || 1
        limit = limit || 3

        let offset = limit * (page-1)

        let paginate = {
            page,
            limit,
            offset,
        }

        const students = await Student.paginate(paginate, filter)

        for(student of students){
            student.grade = student.grade.replace("{", "").replace("}", "")
            student.grade = formatGrade(student.grade)
        }

        const pagination = {
            ...paginate,
            total: Math.ceil(students[0].total_students / limit)
        }

        req.students = {
            students,
            pagination,
            filter
        }

        next()
    } catch (error) {
        console.error(error);
    }
    
}

async function show(req, res, next){
    try {
        const { id } = req.params
        let student = await Student.findOne(id)

        student.grade = student.grade.replace("{", "").replace("}", "")
        student.grade = formatGrade(student.grade)

        student.age = age(student.birth)
        student.birth_day = date(student.birth).birthDay
        student.grade = formatGrade(student.grade)

        const teacher = await Teacher.findOne(student.teacher_id)

        req.student = {
            student,
            teacher
        }

        next()
    } catch (error) {
        console.error(error);
    }
    
}

module.exports = {
    post,
    show,
    table
}