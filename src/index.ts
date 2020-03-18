import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import session from "express-session";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloWorldResolver } from "./resolvers/HelloWorldResolver";
import { MovieResolver } from "./resolvers/MovieResolver";
import { AuthResolver } from "./resolvers/AuthResolver";
import { BookResolver } from "./resolvers/BookResolver";
import connectMongoDB from "connect-mongodb-session";
import dotenv from "dotenv";

const MongoDBStore = connectMongoDB(session);

dotenv.config();

(async () => {
  const app = express();

  app.use(
    session({
      store: new MongoDBStore({
        uri: process.env.MONGO_DB_URL || "localhost",
        collection: "sessions"
      }),
      name: "qid",
      secret: process.env.SESSION_SECRET || "aslkdfjoiq12312",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365 // 7 years
      }
    })
  );

  await createConnection({
    type: "mongodb",
    host: "localhost",
    port: 27017,
    database: "test",
    username: "test",
    password: "password",
    cache: {
      duration: 30000 // 30 seconds
    }
  });

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [AuthResolver, BookResolver, HelloWorldResolver, MovieResolver]
    }),
    context: ({ req, res }) => ({ req, res }),
    playground: {
      settings: {
        "request.credentials": "include"
      }
    }
  });

  apolloServer.applyMiddleware({ app, cors: false });

  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => {
    console.log("express server started");
  });
})();
