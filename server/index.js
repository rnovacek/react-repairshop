
const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');

const { authenticate } = require('./authentication');

dotenv.config();

if (!process.env.SECRET) {
    console.error('Secret key not specified');
    process.exit(1);
}

const connectMongo = require('./mongo-connector');
const schema = require('./schema');

const start = async () => {
    const app = express();

    const mongo = await connectMongo();

    const buildOptions = async (req, res) => {
        const user = await authenticate(req, mongo.Users);
        return {
            context: { mongo, user, res },
            schema,
        };
    };

    app.use('/graphql', bodyParser.json(), graphqlExpress(buildOptions));
    app.use('/graphiql', graphiqlExpress(buildOptions));

    app.listen(process.env.PORT, () => {
        console.log(`Listening on port ${process.env.PORT}`);
    });
};

start();
