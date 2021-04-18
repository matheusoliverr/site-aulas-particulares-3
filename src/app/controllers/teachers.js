const { age, graduation, date } = require('../../lib/utils')
const Student = require('../models/Student')
const Teacher = require("../models/Teacher")


module.exports = {
    
    async table(req,res){
        const { teachers, pagination, filter } = req.teachers

        return res.render("teach/teachers", {teachers, pagination, filter} )

    },

    create(req,res){
        return res.render("teach/create")
    },

    async post(req,res){
        try {
            let { name, avatar_url, birth, education_level, class_type, acting_area } = req.body

            await Teacher.create({
                name,
                avatar_url,
                birth,
                education_level,
                class_type,
                acting_area
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
    
        return res.render("teach/show", {teacher: req.teacher})

    },
    
    async edit(req,res){
        
        return res.render("teach/edit", { teacher: req.teacher })

    },
    
    async put(req,res){
        try {
            let { id, name, avatar_url, birth, education_level, class_type, acting_area } = req.body

            await Teacher.update(id, {
                name,
                avatar_url,
                birth,
                education_level,
                class_type,
                acting_area
            })

            const teacher = await Teacher.findOne(id)

            const timestamp = Date.parse(teacher.birth)
            teacher.age = age(timestamp)
            const formatDate = date(teacher.creation_date).iso
            const newDate = formatDate.split("-")

            teacher.creation_date = []

            teacher.creation_date[0] = `0${newDate[2]}`.slice(-2)
            teacher.creation_date[1] = `0${newDate[1]}`.slice(-2)
            teacher.creation_date[2] = `0${newDate[0]}`.slice(-2)

            return res.render("teach/show", {
                teacher,
                success: "Cadastro atualizado com sucesso!"
            })
        } catch (error) {
            console.error(error)
            return res.render("teach/show", {
                teacher,
                error: "Erro na atualização!"
            })
        }

    },
    
    async delete(req,res){
        try {
            await Teacher.delete(req.body.id)

            return res.render("teach/teachers", {
                success: "Conta deletada com sucesso!"
            })
        } catch (error) {
            console.error(error)
            return res.render("teach/teachers", {
                error: "Ocorreu um erro ao deletar sua conta!"
            })
        }
            
    },
    
}