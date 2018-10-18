const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLNonNull,
	GraphQLID
} = require('graphql');

module.exports = new GraphQLObjectType({
	name: 'NameType',

	fields: () => {
		const UserType = require('./user');
		const TotalVotesType = require('./total-votes');

		return {
			id: { type: new GraphQLNonNull(GraphQLID) },
			label: { type: new GraphQLNonNull(GraphQLString) },
			description: { type: GraphQLString },
			createdAt: { type: new GraphQLNonNull(GraphQLString) },
			createdBy: {
				type: UserType,
				resolve: (obj, args, { loaders }) => {
					return loaders.usersByIds.load(obj.createdBy);
				}
			},
			totalVotes: {
				type: TotalVotesType,
				resolve: (obj, args, { loaders }) => {
					return loaders.totalVotesByNames.load(obj.id);
				}
			}
		};
	}
});
