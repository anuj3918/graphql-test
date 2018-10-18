const humps = require('humps');
const _ = require('lodash');

const orderedFor = (rows, collection, field, singleObject) => {
	const data = humps.camelizeKeys(rows);
	const inGroups = _.groupBy(data, field);

	var ans = collection.map((c)=> {
		if (inGroups[c]) {
			return singleObject ? inGroups[c][0] : inGroups[c];
		}
		return singleObject ? {} : [];
	});

	return ans;
};

module.exports = {
	nodeEnv: process.env.NODE_ENV || 'development',
	orderedFor
};
