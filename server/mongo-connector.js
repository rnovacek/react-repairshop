const { MongoClient } = require('mongodb');

module.exports = async () => {
    const db = await MongoClient.connect(process.env.MONGO_URL);
    return {
        Repairs: db.collection('repairs'),
        Users: db.collection('users'),
        Comments: db.collection('comments'),
    };
};
