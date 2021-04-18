const db = require("../../config/db")

function find(table, filters){
    let query = `SELECT * FROM ${table}`

    if(filters){
        Object.keys(filters).map(filter => {
            query += ` ${filter}`

            Object.keys(filters[filter]).map(key => {
                query += ` ${key} = ${filters[filter][key]}`
            })
        })
    }

    query += ` ORDER BY name ASC`
    
    return db.query(query)
}

const Base = {
    init({table}){

        if(!table) throw new Error('invalid params')

        this.table = table

        return this
    },
    async create(fields){
        try {
            let keys = []
            let values = []

            Object.keys(fields).map(key => {
                keys.push(key)
                values.push(`'${fields[key]}'`)
            })

            const query = `
                INSERT INTO ${this.table}(
                    ${keys.join(",")}
                ) VALUES (${values.join(",")})
                RETURNING id
            `

            const results = await db.query(query)

            return results.rows[0]

        } catch (error) {
            console.error(error);
        }
    },
    async update(id, fields){
        try {
            let update = []

            Object.keys(fields).map(key => {
                update.push(`${key} = '${fields[key]}'`)
            })

            const query = `
            UPDATE ${this.table} SET
                ${update.join(",")}
            WHERE id = ${id}
            `

            const results = await db.query(query)
            return results.rows[0]
        } catch (error) {
            console.error(error)
        }
        
    },
    async findAll(filters){
        try {
            const results = await find(this.table, filters)
            return results.rows
        } catch (error) {
            console.error(error);
        }
    },
    async findTeacher(filters){
        try {
            const results = await find('teachers', filters)
            return results.rows
        } catch (error) {
            console.error(error);
        }
    },
    async findOne(id){
        try {
            const results = await find(this.table, {where: {id}})
            return results.rows[0]
        } catch (error) {
            console.error(error);
        }
        
    },
    async paginate(paginate, filter){
        try {
            const { limit, offset } = paginate

            let results = 1
            let queryFilter = ``

            let queryTotal = `(SELECT count(*) FROM ${this.table}) AS total_${this.table}`

            let query = `SELECT *, ${queryTotal} 
                FROM ${this.table}
            `

            if(filter){
                if(this.table == 'students'){
                    queryFilter = `WHERE students.name ILIKE '%${filter}%'
                    OR students.email ILIKE '%${filter}%'`

                } else if(this.table == 'teachers'){
                    queryFilter = `WHERE teachers.name ILIKE '%${filter}%'
                    OR teachers.acting_area ILIKE '%${filter}%'`
                        
                }

                queryTotal = `(SELECT count(*) FROM ${this.table} ${queryFilter}) AS total_${this.table}`
                query = `SELECT *, ${queryTotal} 
                FROM ${this.table} ${queryFilter}
                `
                
            }

            if(limit){
                query = `${query}
                LIMIT $1 OFFSET $2
                `

                results = await db.query(query, [limit, offset])
            } else {

                results = await db.query(query)

            }

            return results.rows
        } catch (error) {
            console.error(error);
        }
        
    },
    delete(id){
        try {
            return db.query(`
            DELETE FROM ${this.table}
            WHERE id = $1`, [id]
            )
        } catch (error) {
            console.error(error);
        }
        
    }
}

module.exports = Base
