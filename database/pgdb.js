const humps = require("humps")
const _ = require("lodash")

module.exports = (pgPool) => {
    const orderedFor = (rows, collection, field) => {
        const data = humps.camelizeKeys(rows)
        const inGroups = _.groupBy(data, field)

        var ans =  collection.map((c)=> {
            if(inGroups[c]){
                return inGroups[c][0]
            } else {
                return {}
            }
        })

        return  ans
    }

    return {
        getUserByApiKey(apiKey){
            return pgPool.query(`
            select * from users
            where api_key = $1
            `, [apiKey]).then(result=>{
                return humps.camelizeKeys(result.rows[0])
            })
        },
        getUsersByIds(userIds){
            return pgPool.query(`
            select * from users
            where id = ANY($1)
            `, [userIds]).then(result=>{
                return orderedFor(result.rows, userIds, 'id')
            })
        },
        getContests(user){
            return pgPool.query(`
            select * from contests
            where created_by = $1
            `, [user.id]).then(result=>{
                return humps.camelizeKeys(result.rows)
            })
        },
        getNames(contest){
            return pgPool.query(`
            select * from names
            where contest_id = $1
            `, [contest.id]).then(result=>{
                return humps.camelizeKeys(result.rows)
            })
        }
    }
}