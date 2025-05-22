import session from "express-session";
import mongoDbSession from "connect-mongodb-session";
import { CONNECTION_STRING } from "./data";

const MongoDBStore = mongoDbSession(session);

const mongoStore = new MongoDBStore({
    uri: CONNECTION_STRING,
    collection: "sessions",
    databaseName: "jamaican_dishes"
});

mongoStore.on("error", (error) => {
    console.log("Session store error:", error);
});

const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET ?? "my-super-unsafe-secret",
    store: mongoStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        secure: false
    }
});

export default sessionMiddleware;
