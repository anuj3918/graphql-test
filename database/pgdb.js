const humps = require("humps")
const _ = require("lodash")

module.exports = (pgPool) => {
    const orderedFor = (rows, collection, field, singleObject) => {
        const data = humps.camelizeKeys(rows)
        const inGroups = _.groupBy(data, field)

        var ans =  collection.map((c)=> {
            if(inGroups[c]){
                return singleObject ? inGroups[c][0] : inGroups[c]
            } else {
                return singleObject? {} : []
            }
        })

        return  ans
    }

    return {
        getUsersByApiKeys(apiKeys){
            return pgPool.query(`
            select * from users
            where api_key = ANY($1)
            `, [apiKeys]).then(result=>{
                return orderedFor(result.rows, apiKeys, 'apiKey', true)
            })
        },
        getUsersByIds(userIds){
            return pgPool.query(`
            select * from users
            where id = ANY($1)
            `, [userIds]).then(result=>{
                return orderedFor(result.rows, userIds, 'id', true)
            })
        },
        getContestsForUserIds(userIds){
            return pgPool.query(`
            select * from contests
            where created_by = ANY($1)
            `, [userIds]).then(result=>{
                return orderedFor(result.rows, userIds, 'createdBy', false)
            })
        },
        getNamesByContestIds(contestIds){
            return pgPool.query(`
            select * from names
            where contest_id = ANY($1)
            `, [contestIds]).then(result=>{
                return orderedFor(result.rows, contestIds, 'contestId', false)
            })
        }
    }
}