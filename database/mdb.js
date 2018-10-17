const humps = require("humps")

module.exports = (mPool) => {
    return {
        getCount(user, countField){
            return mPool.collection("users")
            .findOne({ userId: user.id})
            .then(userCounts => userCounts[countField])
        }
    }
}