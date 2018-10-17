const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
    GraphQLNonNull
} = require("graphql")

const pgDb = require("../database/pgdb")

const RootQueryType = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: () => {
        const UserType = require('./types/user')
        return {
            user: {
                type: UserType,
                description: "User based on apiKey",
                args: {
                    key: { type: new GraphQLNonNull(GraphQLString) }
                },
                resolve: (obj, args, { pgPool }) => {
                    return pgDb(pgPool).getUserByApiKey(args.key);
                }
            }
        }
    }
})

const ncSchema = new GraphQLSchema({
    query: RootQueryType
    // mutation : {}
})

module.exports = ncSchema