const { makeExecutableSchema } = require('graphql-tools');
const resolvers = require('./resolvers');

const typeDefs = `
    scalar DateTime

    type Repair {
        id: ID!
        title: String!
        isComplete: Boolean!
        timestamp: DateTime!
        assignedTo: User
    }
    
    type User {
        id: ID!
        name: String!
        username: String!
        isManager: Boolean!
    }

    type Query {
        allRepairs: [Repair!]!
        allUsers: [User!]!
    }
    
    type Mutation {
        createRepair(
            title: String!,
            timestamp: DateTime,
            assignedTo: UserInput,
        ): Repair
        
        createUser(
            name: String!,
            username: String!,
            password: String,
            isManager: Boolean!
        ): User
    }
    
    input UserInput {
        id: ID!
    } 
`;

module.exports = makeExecutableSchema({ typeDefs, resolvers });
