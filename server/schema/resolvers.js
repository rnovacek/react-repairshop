
module.exports = {
    Query: {
        allRepairs: async (root, data, { mongo: { Repairs } }) => {
            return Repairs.find({}).toArray();
        },
        allUsers: async (root, data, { mongo: { Users } }) => {
            return Users.find({}).toArray();
        },
    },

    Mutation: {
        createRepair: async (root, data, { mongo: { Repairs } }) => {
            const response = await Repairs.insert(data);
            return {
                ...data,
                id: response.insertedIds[0],
            };
        },
        createUser: async (root, data, { mongo: { Users } }) => {
            const response = await Users.insert(data);
            return {
                ...data,
                id: response.insertedIds[0],
            };
        },
    },

    Repair: {
        id: root => root._id || root.id,
    },

    User: {
        id: root => root._id || root.id,
    },
};
