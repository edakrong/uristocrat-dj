import { ApolloServer, gql } from "apollo-server-micro";
import { Prisma } from "../../prisma/generated/prisma-client";
import { getUserId, signup, login } from "./util";

const prisma = new Prisma();

export const typeDefs = gql`
  type Query {
    users: [User!]!
    me: User
  }
  type Mutation {
    signup(
      email: String!
      password: String!
      firstName: String!
      lastName: String!
    ): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
  }
  type User {
    firstName: String
    lastName: String
    email: String
  }
  type AuthPayload {
    token: String!
    user: User!
  }
`;

const resolvers = {
  Query: {
    users(parent, args, context) {
      return prisma.users();
    },
    me(parent, args, context) {
      const id = getUserId(context);
      return prisma.user({ id });
    }
  },
  Mutation: {
    signup,
    login
  }
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: request => ({
    ...request,
    prisma
  })
});

export const config = {
  api: {
    bodyParser: false
  }
};

export default apolloServer.createHandler({ path: "/api/graphql" });
