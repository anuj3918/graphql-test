const { nodeEnv } = require('./util');
console.log(`Running in ${nodeEnv} mode...`);

const app = require('express')();
const graphqlHTTP = require('express-graphql');

const DataLoader = require('dataloader');

const ncSchema = require('../schema');

const pg = require('pg');
const pgConfig = require('../config/pg')[nodeEnv];
const pgPool = new pg.Pool(pgConfig);
const pgDb = require('../database/pgdb')(pgPool);

const { MongoClient, Logger } = require('mongodb');
const assert = require('assert');
const mConfig = require('../config/mongo')[nodeEnv];

MongoClient.connect(mConfig.url, (err, mPool) => {
	assert.equal(err, null);

	const mDb = require('../database/mdb')(mPool);

	Logger.setLevel('debug');
	Logger.filter('class', ['Server']);

	app.use('/graphql', (req, res) => {
		var loaders = {
			usersByIds: new DataLoader(pgDb.getUsersByIds),
			usersByApiKeys: new DataLoader(pgDb.getUsersByApiKeys),
			contestsForUserIds: new DataLoader(pgDb.getContestsForUserIds),
			namesByContestIds: new DataLoader(pgDb.getNamesByContestIds),
			totalVotesByNames: new DataLoader(pgDb.getTotalVotesByNames),
			mdbUsersByIds: new DataLoader(mDb.getUsersByIds)
		};

		graphqlHTTP({
			schema: ncSchema,
			graphiql: true,
			context: {
				pgPool,
				mPool,
				loaders
			}
		})(req, res);
	});

	const PORT = process.env.PORT || 3000;
	app.listen(PORT, () => {
		console.log(`Server listening on port: ${PORT}`);
	});
});

