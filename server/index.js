
const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');

dotenv.config();

const connectMongo = require('./mongo-connector');
const schema = require('./schema');

const start = async () => {
    const app = express();

    const mongo = await connectMongo();

    // bodyParser is needed just for POST.
    app.use('/graphql', bodyParser.json(), graphqlExpress({
        context: {
            mongo,
        },
        schema,
    }));

    app.use('/graphiql', graphiqlExpress({
        endpointURL: '/graphql',
    }));

    app.listen(process.env.PORT, () => {
        console.log(`Listening on port ${process.env.PORT}`);
    });
};

start();
