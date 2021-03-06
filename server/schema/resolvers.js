

const { ObjectId } = require('mongodb');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');
const authentication = require('../authentication');
const addHours = require('date-fns/add_hours');

const checkUser = (user, res) => {
    if (!user) {
        res.statusCode = 401;
        throw new Error('error-not-authenticated');
    }
};

const checkAdmin = (user, res) => {
    checkUser(user, res);
    if (!user.isAdmin) {
        res.statusCode = 403;
        throw new Error('error-not-admin');
    }
};

const checkRepairCollision = async (repair, Repairs) => {
    const oid = repair.id ? new ObjectId(repair.id) : null;

    console.log('Looking for collision', oid, repair.scheduledTo, addHours(repair.scheduledTo, 1));
    const colliding = await Repairs.find({
        _id: {
            $ne: oid,
        },
        scheduledTo: {
            $gte: repair.scheduledTo,
            $lt: addHours(repair.scheduledTo, 1),
        },
    }).count();

    if (colliding > 0) {
        throw new Error('Repair is colliding with another repair');
    }
};

module.exports = {
    Query: {
        allRepairs: async (root, data, ctx) => {
            checkUser(ctx.user, ctx.res);
            return ctx.mongo.Repairs.find({}).toArray();
        },
        allUsers: async (root, data, ctx) => {
            checkUser(ctx.user, ctx.res);
            return ctx.mongo.Users.find({}).toArray();
        },
        me: async (root, data, ctx) => {
            return ctx.user;
        },
    },

    Mutation: {
        createRepair: async (root, { input }, ctx) => {
            checkAdmin(ctx.user, ctx.res);

            if (!input.title) {
                throw new Error('Title must be filled');
            }

            if (!input.scheduledTo) {
                throw new Error('Repair needs to be scheduled');
            }

            await checkRepairCollision(input, ctx.mongo.Repairs);

            const response = await ctx.mongo.Repairs.insertOne(input);
            const oid = response.insertedId;
            return {
                repair: await ctx.mongo.Repairs.findOne({ _id: oid }),
            };
        },
        updateRepair: async (root, { input }, ctx) => {
            checkAdmin(ctx.user, ctx.res);

            if (!input.title) {
                throw new Error('Title must be filled');
            }

            if (!input.scheduledTo) {
                throw new Error('Repair needs to be scheduled');
            }
            const { id, assignedTo, ...data } = input;
            const oid = new ObjectId(id);

            await checkRepairCollision(input, ctx.mongo.Repairs);

            await ctx.mongo.Repairs.updateOne(
                { _id: oid },
                {
                    $set: {
                        ...data,
                        assignedTo: assignedTo ? ObjectId(assignedTo.id) : null,
                    },
                },
            );
            return {
                repair: await ctx.mongo.Repairs.findOne({ _id: oid }),
            };
        },
        completeRepair: async (root, { input }, ctx) => {
            checkUser(ctx.user, ctx.res);

            const oid = new ObjectId(input.id);
            const repair = await ctx.mongo.Repairs.findOne({ _id: oid });
            if ((!repair.assignedTo || !ctx.user._id.equals(repair.assignedTo)) && !ctx.user.isAdmin) {
                throw new Error('Repair must be assigned to you to mark it as completed');
            }

            await ctx.mongo.Repairs.updateOne(
                { _id: oid },
                {
                    $set: {
                        status: 'COMPLETED',
                    },
                },
            );
            return {
                repair: ctx.mongo.Repairs.findOne({ _id: oid }),
            };
        },
        approveRepair: async (root, { input }, ctx) => {
            checkAdmin(ctx.user, ctx.res);

            const oid = new ObjectId(input.id);

            await ctx.mongo.Repairs.updateOne(
                { _id: oid },
                {
                    $set: {
                        status: 'APPROVED',
                    },
                },
            );
            return {
                repair: ctx.mongo.Repairs.findOne({ _id: oid }),
            };
        },
        commentRepair: async (root, { input }, ctx) => {
            checkUser(ctx.user, ctx.res);

            const oid = new ObjectId(input.repair.id);
            await ctx.mongo.Comments.insertOne({
                body: input.body,
                repair: oid,
                author: ctx.user._id,
                createdAt: new Date(),
            });
            return {
                repair: ctx.mongo.Repairs.findOne({ _id: oid }),
            };
        },
        deleteRepair: async (root, { input }, ctx) => {
            checkAdmin(ctx.user, ctx.res);

            const { id } = input;
            const oid = new ObjectId(id);
            const response = await ctx.mongo.Repairs.deleteOne({ _id: oid });
            if (response.deletedCount === 0) {
                throw new Error('No such repair');
            }
            await ctx.mongo.Comments.deleteMany({ repair: oid });
            return {
                id,
            };
        },

        createUser: async (root, { input }, ctx) => {
            checkAdmin(ctx.user, ctx.res);

            const { password, ...data } = input;

            if (!data.username) {
                throw new Error('Username must be filled');
            }

            if (!password) {
                throw new Error('Password must be filled');
            }

            const user = await ctx.mongo.Users.findOne({ username: data.username });
            if (user) {
                throw new Error(`User with username "${data.username}" already exists`);
            }

            const encryptedPassword = await authentication.encrypt(password);
            await ctx.mongo.Users.insertOne({
                ...data,
                encryptedPassword,
            });
            return {
                user: await ctx.mongo.Users.findOne({ username: data.username }),
            };
        },
        updateUser: async (root, { input }, ctx) => {
            checkAdmin(ctx.user, ctx.res);

            const { id, password, ...data } = input;
            if (password) {
                data.encryptedPassword = await authentication.encrypt(password);
            }
            const oid = new ObjectId(id);
            await ctx.mongo.Users.updateOne(
                { _id: oid },
                { $set: data },
            );
            return {
                user: await ctx.mongo.Users.findOne({ _id: oid }),
            };
        },
        deleteUser: async (root, { input }, ctx) => {
            checkAdmin(ctx.user, ctx.res);

            const { id } = input;
            const oid = new ObjectId(id);
            const response = await ctx.mongo.Users.deleteOne({ _id: oid });
            if (response.deletedCount === 0) {
                throw new Error('No such user');
            }
            return {
                id,
            };
        },

        login: async (root, { input }, ctx) => {
            const user = await ctx.mongo.Users.findOne({ username: input.username });
            if (user) {
                const token = await authentication.login(user, input.password);
                if (token) {
                    return {
                        token,
                        user,
                    };
                }
            }
            return {
                token: null,
                user: null,
            };
        },
        register: async (root, { input }, ctx) => {
            const user = await ctx.mongo.Users.findOne({ username: input.username });
            if (user) {
                throw new Error('User already exists');
            }
            const { password, ...data } = input;
            const encryptedPassword = await authentication.encrypt(password);
            await ctx.mongo.Users.insertOne({
                ...data,
                isAdmin: false,
                encryptedPassword,
            });
            const newUser = await ctx.mongo.Users.findOne({ username: input.username });
            const token = await authentication.login(newUser, password);
            return {
                token,
                newUser,
            };
        },
    },

    Repair: {
        id: root => root._id || root.id,
        assignedTo: async ({ assignedTo }, data, ctx) => {
            return ctx.mongo.Users.findOne({ _id: assignedTo });
        },
        comments: async (repair, data, ctx) => {
            return ctx.mongo.Comments.find({ repair: repair._id }).toArray();
        },
    },

    User: {
        id: root => root._id || root.id,
    },

    Comment: {
        id: root => root._id || root.id,
        author: async ({ author }, data, ctx) => {
            return ctx.mongo.Users.findOne({ _id: author });
        },
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
