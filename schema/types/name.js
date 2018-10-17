const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLID,
    GraphQLList

} = require("graphql")

const pgDb = require("../../database/pgdb")

module.exports = new GraphQLObjectType({
    name: 'NameType',

    fields: () => {
        const UserType = require('./user')
        return {
            id: { type: new GraphQLNonNull(GraphQLID)},
            label: {type: new GraphQLNonNull(GraphQLString)},
            description: {type: GraphQLString},
            createdAt: {type: new GraphQLNonNull(GraphQLString)},
            createdBy: {
                type: UserType,
                resolve: (obj, args, { loaders }) => {
                    return loaders.usersByIds.load(obj.createdBy)
                }
            }
        }
    }
})