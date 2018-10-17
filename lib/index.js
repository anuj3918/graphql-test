const { nodeEnv } = require('./util');
console.log(`Running in ${nodeEnv} mode...`);

const app = require("express")();
const graphqlHTTP = require("express-graphql")

const DataLoader = require("dataloader")

const ncSchema = require("../schema")
const {graphql} = require("graphql")

const pg = require("pg")
const pgConfig = require("../config/pg")[nodeEnv]
const pgPool = new pg.Pool(pgConfig)
const pgDb = require("../database/pgdb")(pgPool)

const { MongoClient} = require("mongodb")
const assert = require("assert")
const mConfig = require("../config/mongo")[nodeEnv]

MongoClient.connect(mConfig.url, (err, mPool) => {
    assert.equal(err, null)

    app.use("/graphql", (req, res) => {
        var loaders = {
            usersByIds: new DataLoader(pgDb.getUsersByIds)
        }
            
        graphqlHTTP({
            schema: ncSchema,
            graphiql: true,
            context: {
                pgPool,
                mPool,
                loaders
            }
        })(req, res)
    });
    
    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => {
        console.log(`Server listening on port: ${PORT}`);
    })
})



