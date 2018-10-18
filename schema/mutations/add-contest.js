const {
	GraphQLString,
	GraphQLNonNull,
	GraphQLInputObjectType
} = require('graphql');

const pgDb = require('../../database/pgdb');

const ContestInputType = new GraphQLInputObjectType({
	name: 'ContestInput',

	fields: {
		apiKey: { type: new GraphQLNonNull(GraphQLString) },
		title: { type: new GraphQLNonNull(GraphQLString) },
		description: { type: GraphQLString }
	}
});

const Contest = require('../types/contest');

module.exports = {
	type: Contest, // The type of value that will be returned
	args: {
		input: { type: new GraphQLNonNull(ContestInputType) }
	},
	resolve: (obj, { input }, { pgPool }) =>{
		return pgDb(pgPool).addNewContest(input);
	}
};
