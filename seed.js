const faker = require('faker')
const Teacher = require("./src/app/models/Teacher")
const Student = require("./src/app/models/Student")
const { date } = require('./src/lib/utils')

let teachersIds = []

let totalTeachers = 10
    totalStudents = 5

const educationLevel = ["Ensino Médio Completo", "Ensino Superior Completo", "Mestrado", "Doutorado"]

const actingArea = ["Português", "Literatura", "Matemática", "Física", "História", "Geografia", "Química", "Sociologia", "Filosofia", "Ed. Física", "Inglês"]

const grade = ["5F","6F","7F","8F","9F","1M","2M","3M"]
        

async function createTeachers(){
    let teachers = []
    while(teachers.length < totalTeachers){
        teachers.push({
            name: faker.name.firstName(),
            avatar_url: faker.image.image(),
            birth: date(Date.parse(faker.date.past(20))).iso,
            education_level: `${educationLevel[Math.floor(Math.random()*4)]}`,
            class_type: faker.datatype.number(Math.ceil(Math.random()*2)),
            acting_area: `${actingArea[Math.floor(Math.random()*11)]}`
        })
    }

    const teachersPromise = teachers.map(teacher => Teacher.create(teacher))

    teachersIds = await Promise.all(teachersPromise)

}

async function createStudents(){
    let students = []
    while(students.length<totalStudents){
        students.push({
            name: faker.name.firstName(),
            avatar_url: faker.image.image(),
            birth: date(Date.parse(faker.date.past())).iso,
            email: faker.internet.email(),
            grade: `${grade[Math.floor(Math.random()*8)]}`,
            study_load: faker.datatype.number(Math.ceil(Math.random()*30)),
            teacher_id: teachersIds[Math.floor(Math.random() * totalTeachers)].id
        })
    }

    const studentsPromise = students.map(student => Student.create(student))

    await Promise.all(studentsPromise)
}

async function init(){
    await createTeachers()
    await createStudents()
}

init()