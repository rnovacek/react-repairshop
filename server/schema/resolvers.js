
const { ObjectId } = require('mongodb');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');
module.exports = {
    Query: {
        allRepairs: async (root, data, { mongo: { Repairs } }) => {
            return Repairs.find({}).toArray();
        },
        allUsers: async (root, data, { mongo: { Users } }) => {
            return Users.find({}).toArray();
        me: async (root, data, ctx) => {
            return ctx.user;
        },
    },

    Mutation: {
        createRepair: async (root, { input }, ctx) => {
            const response = await ctx.mongo.Repairs.insertOne(input);
            const oid = response.insertedIds[0];
            return {
                repair: ctx.mongo.Repairs.findOne({ _id: oid }),
            };
        },
        updateRepair: async (root, { input }, ctx) => {

            const { id, ...data } = input;
            const oid = new ObjectId(id);
            await ctx.mongo.Repairs.updateOne(
                { _id: oid },
                { $set: data },
            );
            return {
                repair: ctx.mongo.Repairs.findOne({ _id: oid }),
            };
        },
        completeRepair: async (root, { input }, ctx) => {

            const { id, completedBy, ...data } = input;
            const oid = new ObjectId(id);
            await ctx.mongo.Repairs.updateOne(
                { _id: oid },
                {
                    $set: {
                        ...data,
                        completedBy: new ObjectId(completedBy.id),
                    },
                },
            );
            return {
                repair: ctx.mongo.Repairs.findOne({ _id: oid }),
            };
        },
        createUser: async (root, { input }, ctx) => {

            const { password, ...data } = input;
            const encryptedPassword = await authentication.encrypt(password);
            const response = await ctx.mongo.Users.insertOne({
                ...data,
                isAdmin: data.isAdmin || false,
                encryptedPassword,
            });
            return {
                user: {
                    ...input,
                    id: response.insertedIds[0],
                },
            };
        },
    },

    Repair: {
        id: root => root._id || root.id,
    },

    User: {
        id: root => root._id || root.id,
    },

    DateTime: new GraphQLScalarType({
        name: 'DateTime',
        description: 'DateTime as an ISO String',
        serialize(value) {
            if (!value) {
                return null;
            }
            if ((value instanceof Date)) {
                return value.toISOString();
            }
            return value;
        },
        parseValue(value) {
            if (!value) {
                return null;
            }
            try {
                return new Date(value);
            } catch (e) {
                return null;
            }
        },
        parseLiteral(ast) {
            if (ast.kind === Kind.STRING) {
                return ast.value;
            }
            return null;
        },
    }),
};
