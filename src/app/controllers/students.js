const { age, formatGrade, date } = require('../../lib/utils')
const Student = require("../models/Student")
const Teacher = require("../models/Teacher")

module.exports = {
    async table(req,res){
        const { students, pagination, filter } = req.students

        return res.render("study/students", {students, pagination, filter} )

    },

    async create(req,res){
        const teachers = await Student.findTeacher()

        return res.render("study/create", { teachers })
        
    },

    async post(req,res){
        try {
            let { name, avatar_url, birth, email, grade, study_load, teacher_id } = req.body

            const student = await Student.create({
                name, 
                avatar_url, 
                birth, 
                email, 
                grade, 
                study_load, 
                teacher_id
            })

            return res.render("success", {
                success: "Cadastro realizado com sucesso!"
            })
        } catch (error) {
            console.error(error)
            return res.render("error", {
                error: "Erro no cadastro!"
            })
        }
        
        
    },

    async show(req,res){
        const { student, teacher } = req.student
        return res.render("study/show", {student, teacher})
        
    },

    async edit(req,res){
        const { id } = req.params
        
        let student = await Student.findOne(id)

        student.birth= date(student.birth).iso

        const teachers = await Student.findTeacher()

        return res.render("study/edit", {student, teachers})
    },

    async put(req,res){
        try {
            let { id, name, avatar_url, birth, email, grade, study_load, teacher_id } = req.body

            await Student.update(id, {
                name,
                avatar_url,
                birth,
                email,
                grade,
                study_load,
                teacher_id
            })

            const student = await Student.findOne(id)

            student.grade = student.grade.replace("{", "").replace("}", "")
            student.grade = formatGrade(student.grade)

            student.age = age(student.birth)
            student.birth_day = date(student.birth).birthDay
            student.grade = formatGrade(student.grade)

            const teacher = await Teacher.findOne(student.teacher_id)
            
            return res.render("study/show", {
                student,
                teacher,
                success: "Cadastro atualizado com sucesso!"
            })
        } catch (error) {
            console.error(error)
            return res.render("study/students", {
                error: "Erro na atualização!"
            })
        }
        
    },

    async delete(req,res){
        try {
            await Student.delete(req.body.id)

            return res.render("study/students", {
                success: "Conta deletada com sucesso!"
            })
        } catch (error) {
            console.error(error)
            return res.render("study/students", {
                error: "Ocorreu um erro ao deletar sua conta!"
            })
        }
    }
        
        

}