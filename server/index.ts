import { config } from "dotenv";
config();
import { ApolloServer } from "@apollo/server";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { eq } from "drizzle-orm";
import * as dbSchema from "./schema.js";
import { startStandaloneServer } from "@apollo/server/standalone";
import gql from "graphql-tag";

const client = createClient({
  url: process.env.TURSO_CONNECTION_URL as string,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const db = drizzle({ client, schema: dbSchema });

// GraphQL schema definition
export const typeDefs = gql`
  type Post {
    id: Int!
    year: String!
    publisher: String!
    printedCountry: String!
    illustrator: String!
    ISBN: String!
    price: String!
    purchased: String!
    condition: String!
    fact: String!
    createdAt: String!
    updatedAt: String
  }

  type Query {
    getPosts: [Post!]!
    getPost(id: Int!): Post
  }

  type Mutation {
    createPost(
      year: String!
      publisher: String!
      printedCountry: String!
      illustrator: String!
      ISBN: String!
      price: String!
      purchased: String!
      condition: String!
      fact: String!
    ): Post!

    updatePost(
      id: Int!
      year: String
      publisher: String
      printedCountry: String
      illustrator: String
      ISBN: String
      price: String
      purchased: String
      condition: String
      fact: String
    ): Post!

    deletePost(id: Int!): Boolean!
  }
`;

export const resolvers = {
  Query: {
    getPosts: async (_: any, __: any) => {
      // Fetch all posts from the database
      return db.select().from(dbSchema.aliceTable);
    },

    getPost: async (_: any, { id }: { id: number }) => {
      // Fetch a single post by ID
      const post = await db
        .select()
        .from(dbSchema.aliceTable)
        .where(eq(dbSchema.aliceTable.id, id))
        .limit(1)
        .then(rows => rows[0]); // Get the first row from the result
    
      if (!post) {
        throw new Error(`Post with ID ${id} not found`);
      }
    
      return post;
    },
  },

  Mutation: {
    createPost: async (
      _: any,
      {
        year,
        publisher,
        printedCountry,
        illustrator,
        ISBN,
        price,
        purchased,
        condition,
        fact,
      }: any
    ) => {
      // Insert a new post into the database
      const newPost = await db
        .insert(dbSchema.aliceTable)
        .values({
          year,
          publisher,
          printedCountry,
          illustrator,
          ISBN,
          price,
          purchased,
          condition,
          fact,
        })
        .returning();
      return newPost[0];
    },

    updatePost: async (
      _: any,
      {
        id,
        year,
        publisher,
        printedCountry,
        illustrator,
        ISBN,
        price,
        purchased,
        condition,
        fact,
      }: any
    ) => {
      // Update an existing post
      const updatedPost = await db
        .update(dbSchema.aliceTable)
        .set({
          year,
          publisher,
          printedCountry,
          illustrator,
          ISBN,
          price,
          purchased,
          condition,
          fact,
        })
        .where(eq(dbSchema.aliceTable.id, id))
        .returning();

      return updatedPost[0];
    },

    deletePost: async (_: any, { id }: { id: number }) => {
      // Delete a post by ID
      const result = await db
        .delete(dbSchema.aliceTable)
        .where(eq(dbSchema.aliceTable.id, id))
        .returning();
      return result.length > 0;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
