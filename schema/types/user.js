const { 
    GraphQLObjectType,
    GraphQLString, 
    GraphQLID, 
    GraphQLNonNull,
    GraphQLList,
    GraphQLInt
} = require("graphql")

const pgDb = require("../../database/pgdb")
const mDb = require("../../database/mdb")


const ContestType = require("./contest")

module.exports = new GraphQLObjectType({
    name: "MeType",

    fields: {
        id: { type: GraphQLID},
        email: { type: new GraphQLNonNull(GraphQLString)},
        createdAt: { type: GraphQLString},
        firstName: { type: GraphQLString},
        lastName: { type: GraphQLString},
        fullName: {
            type: GraphQLString,
            resolve: (obj) => {
                return `${obj.firstName} ${obj.lastName}`
            }
        },
        contests: {
            type: new GraphQLList(ContestType),
            description: 'Contests created by this user',
            resolve: (obj, args, { pgPool }) =>{
                return pgDb(pgPool).getContests(obj)
            }
        },
        contestsCount: {
            type: GraphQLInt,
            description: 'Get contestsCount',
            resolve: (obj, args, { mPool }, {fieldName}) =>{
                return mDb(mPool).getCount(obj, fieldName)
            }          
        },
        namesCount: {
            type: GraphQLInt,
            description: 'Get namesCount',
            resolve: (obj, args, { mPool }, {fieldName}) =>{
                return mDb(mPool).getCount(obj, fieldName)
            }          
        },
        votesCount: {
            type: GraphQLInt,
            description: 'Get votesCount',
            resolve: (obj, args, { mPool }, {fieldName}) =>{
                return mDb(mPool).getCount(obj, fieldName)
            }          
        }
    }
})