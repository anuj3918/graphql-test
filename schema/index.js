const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLNonNull } = require('graphql');

const RootQueryType = new GraphQLObjectType({
	name: 'RootQueryType',

	fields: () => {
		const UserType = require('./types/user');
		return {
			user: {
				type: UserType,
				description: 'User based on apiKey',
				args: {
					key: { type: new GraphQLNonNull(GraphQLString) }
				},
				resolve: (obj, args, { loaders }) => {
					return loaders.usersByApiKeys.load(args.key);
				}
			}
		};
	}
});

const AddContestMutation = require('./mutations/add-contest');

const RootMutationType = new GraphQLObjectType({
	name: 'RootMutationType',

	fields: () => {
		return {
			AddContest: AddContestMutation
		};
	}
});

const ncSchema = new GraphQLSchema({
	query: RootQueryType,
	mutation: RootMutationType
});

module.exports = ncSchema;
