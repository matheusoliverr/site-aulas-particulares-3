const db = require("../../config/db")
const Base = require('./Base')

Base.init({table: 'students'})

module.exports = {
    ...Base,
    findStudent(id, callback){
        db.query(`
            SELECT students.*, teachers.name AS teacher_name
            FROM students
            LEFT JOIN teachers ON (students.teacher_id = teachers.id)
            WHERE students.id = $1 `, [id], function(err, results){
                if(err) throw `Database error. ${err}`
                callback(results.rows[0])
            })
    },
}

