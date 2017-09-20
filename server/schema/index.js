const { makeExecutableSchema } = require('graphql-tools');
const resolvers = require('./resolvers');

const typeDefs = `
    scalar DateTime

    type Repair {
        id: ID!
        title: String!
        scheduledTo: DateTime!
        assignedTo: User
        completedAt: DateTime
        completedBy: User
        approvedAt: DateTime
        approvedBy: User
        comments: [Comment!]!
    }

    type User {
        id: ID!
        name: String!
        username: String!
        isManager: Boolean!
    }

    type Comment {
        id: ID!
        body: String!
        author: User!
        createdAt: DateTime!
        repair: Repair!
    }

    type Query {
        allRepairs: [Repair!]!
        allUsers: [User!]!
        me: User!
    }

    type Mutation {
        createRepair(input: CreateRepairInput!): CreateRepairPayload
        updateRepair(input: UpdateRepairInput!): UpdateRepairPayload
        completeRepair(input: CompleteRepairInput!): CompleteRepairPayload
        approveRepair(input: ApproveRepairInput!): ApproveRepairPayload
        deleteRepair(input: DeleteRepairInput!): DeleteRepairPayload

        createUser(input: CreateUserInput!): CreateUserPayload
        updateUser(input: UpdateUserInput!): UpdateUserPayload
        deleteUser(input: DeleteUserInput!): DeleteUserPayload

        login(input: LoginInput!): LoginPayload
        register(input: RegisterInput!): RegisterPayload
    }

    input UserInput {
        id: ID!
    }

    input CreateRepairInput {
        title: String!,
        scheduledTo: DateTime!
        assignedTo: UserInput
    }

    type CreateRepairPayload {
        repair: Repair
    }

    input UpdateRepairInput {
        id: ID!
        title: String
        scheduledTo: DateTime!
        assignedTo: UserInput
    }

    type UpdateRepairPayload {
        repair: Repair
    }

    input CompleteRepairInput {
        id: ID!
        completedBy: UserInput
        isApproved: Boolean
    }

    type CompleteRepairPayload {
        repair: Repair
    }

    input ApproveRepairInput {
        id: ID!
    }

    type ApproveRepairPayload {
        repair: Repair
    }

    input DeleteRepairInput {
        id: ID!
    }

    type DeleteRepairPayload {
        id: ID
    }


    input CreateUserInput {
        name: String!
        username: String!
        password: String
        isAdmin: Boolean
    }

    type CreateUserPayload {
        user: User
    }

    input UpdateUserInput {
        name: String
        username: String
        password: String
        isAdmin: Boolean
    }

    type UpdateUserPayload {
        user: User
    }

    input DeleteUserInput {
        id: ID!
    }

    type DeleteUserPayload {
        id: ID
    }


    input LoginInput {
        username: String!
        password: String!
    }

    type LoginPayload {
        user: User
        token: String
    }

    input RegisterInput {
        name: String!
        username: String!
        password: String!
    }

    type RegisterPayload {
        user: User
        token: String
    }
`;

module.exports = makeExecutableSchema({ typeDefs, resolvers });
