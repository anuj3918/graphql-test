const {
	GraphQLObjectType,
	GraphQLInt
} = require('graphql');

module.exports = new GraphQLObjectType({
	name: 'TotalVotesType',

	fields: () => {
		return {
			up: { type: GraphQLInt },
			down: { type: GraphQLInt }
		};
	}
});
