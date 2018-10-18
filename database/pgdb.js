const { orderedFor, slug } = require('../lib/util');
const humps = require('humps');

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
		},
		addNewContest({ title, description, apiKey }) {
			return pgPool.query(`
			insert into contests(code, title, description, created_by)
			values($1, $2, $3, 
				(select id from users where api_key = $4)
			)
			returning *
			`, [slug(title), title, description, apiKey]).then(result=>{
				return humps.camelizeKeys(result.rows)[0];
			});
		},
		getActivityByUserIds(userIds) {
			return pgPool.query(`
				select created_at, created_by, '' as title, label, 'name' as activity_type  
				from names n 
				where n.created_by = ANY($1)
				union
				select created_at, created_by, title, '' as label, 'contest' as activity_type
				from contests c 
				where c.created_by = ANY($1)
			`, [userIds]).then(result => {
				return orderedFor(result.rows, userIds, 'createdBy', false);
			});
		}
	};
};
