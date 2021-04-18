const { graduation, age, date } = require("../../lib/utils")
const Teacher = require("../models/Teacher")
const Student = require("../models/Student")

function post(req, res, next){
    try {
        const keys = Object.keys(req.body)
    
        for(key of keys){
            if(req.body[key] == "") return res.render("teach/create", {
                teacher: req.body,
                error: "Preencha todos os campos"
            })
        }
        
        formattedBirth = Date.parse(req.body.birth)
        req.body.birth = date(formattedBirth).iso
        req.body.education_level = graduation(req.body.education_level)

        next()

    } catch (error) {
        console.error(error)
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

        
        const teachers = await Teacher.paginate(paginate, filter)
        
        const pagination = {
            ...paginate,
            total: Math.ceil(teachers[0].total_teachers / limit)
        }
        
        req.teachers = {
            teachers,
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
        let teacher = await Teacher.findOne(id)
        
        const timestamp = Date.parse(teacher.birth)
        teacher.age = age(timestamp)
        const formatDate = date(teacher.creation_date).iso
        const newDate = formatDate.split("-")

        teacher.creation_date = []

        teacher.creation_date[0] = `0${newDate[2]}`.slice(-2)
        teacher.creation_date[1] = `0${newDate[1]}`.slice(-2)
        teacher.creation_date[2] = `0${newDate[0]}`.slice(-2)

        req.teacher = teacher

        next()
    } catch (error) {
        console.error(error)
    }
    
}

async function edit(req, res, next){
    try {
        const { id } = req.params
        let teacher = await Teacher.findOne( id )

        teacher.birth = date(teacher.birth).iso

        req.teacher = teacher

        next()
    } catch (error) {
        console.error(error);
    }
    
}

async function deleteTeacher(req, res, next){
    try {
        const { id } = req.body

        const students = await Student.findAll({where: {teacher_id: id}})

        if(students){
            return res.send("Professores com alunos registrados não podem ser excluídos!")
        }

        next()
    } catch (error) {
        console.error(error);
    }
    
}

module.exports = {
    post,
    table,
    show,
    edit,
    deleteTeacher
}
