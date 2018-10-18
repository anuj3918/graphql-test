const { orderedFor } = require('../lib/util');

module.exports = (pgPool) => {
	return {
		getUsersByApiKeys(apiKeys) {
			return pgPool.query(`
            select * from users
            where api_key = ANY($1)
            `, [apiKeys]).then(result=>{
				return orderedFor(result.rows, apiKeys, 'apiKey', true);
			});
		},
		getUsersByIds(userIds) {
			return pgPool.query(`
            select * from users
            where id = ANY($1)
            `, [userIds]).then(result=>{
				return orderedFor(result.rows, userIds, 'id', true);
			});
		},
		getContestsForUserIds(userIds) {
			return pgPool.query(`
            select * from contests
            where created_by = ANY($1)
            `, [userIds]).then(result=>{
				return orderedFor(result.rows, userIds, 'createdBy', false);
			});
		},
		getNamesByContestIds(contestIds) {
			return pgPool.query(`
            select * from names
            where contest_id = ANY($1)
            `, [contestIds]).then(result=>{
				return orderedFor(result.rows, contestIds, 'contestId', false);
			});
		},
		getTotalVotesByNames(nameIds) {
			return pgPool.query(`
            select id, up, down from total_votes_by_name
            where id = ANY($1)
            `, [nameIds]).then(result=>{
				return orderedFor(result.rows, nameIds, 'id', true);
			});
		}
	};
};
