const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLID,
	GraphQLNonNull,
	GraphQLList,
	GraphQLInt
} = require('graphql');

const ContestType = require('./contest');

module.exports = new GraphQLObjectType({
	name: 'UserType',

	fields: {
		id: { type: GraphQLID },
		email: { type: new GraphQLNonNull(GraphQLString) },
		createdAt: { type: GraphQLString },
		firstName: { type: GraphQLString },
		lastName: { type: GraphQLString },
		fullName: {
			type: GraphQLString,
			resolve: (obj) => {
				return `${obj.firstName} ${obj.lastName}`;
			}
		},
		contests: {
			type: new GraphQLList(ContestType),
			description: 'Contests created by this user',
			resolve: (obj, args, { loaders }) =>{
				return loaders.contestsForUserIds.load(obj.id);
			}
		},
		contestsCount: {
			type: GraphQLInt,
			description: 'Get contestsCount',
			resolve: (obj, args, { loaders }, { fieldName }) =>{
				return loaders.mdbUsersByIds.load(obj.id)[fieldName];
			}
		},
		namesCount: {
			type: GraphQLInt,
			description: 'Get namesCount',
			resolve: (obj, args, { loaders }, { fieldName }) =>{
				return loaders.mdbUsersByIds.load(obj.id)[fieldName];
			}
		},
		votesCount: {
			type: GraphQLInt,
			description: 'Get votesCount',
			resolve: (obj, args, { loaders }, { fieldName }) =>{
				return loaders.mdbUsersByIds.load(obj.id)[fieldName];
			}
		}
	}
});
