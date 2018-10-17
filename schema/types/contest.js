const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLID,
    GraphQLList

} = require("graphql")

const pgDb = require("../../database/pgdb")

module.exports = new GraphQLObjectType({
    name: 'ContestType',

    fields: () => {
        const NameType = require("./name")
        const ContestStatusType = require("./contest-status")

        return {
            id: {type: GraphQLID},
            description: {type: GraphQLString},
            code: {type: new GraphQLNonNull(GraphQLString)},
            title: {type: new GraphQLNonNull(GraphQLString)},
            createdAt: {type: new GraphQLNonNull(GraphQLString)},
            status: {
                type: new GraphQLNonNull(ContestStatusType)
            },
            names: {
                type: new GraphQLList(NameType),
                resolve: (obj, args, { pgPool }) => {
                    return pgDb(pgPool).getNames(obj)
                }
            }
        }
    }
})