
const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config({path: "./config.env"})

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.ATLAS_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let database;

module.exports = {
  connectToServer: async () => {
    console.log("Attempting to connect to MongoDB...");

    try {
      await client.connect();
      database = client.db("meatCatalog");
      console.log("Successfully connected to MongoDB.");
    } catch (err) {
      console.error("MongoDB connection error:", err);
      throw err;
    }
  },

  getDb: () => {
    if (!database) {
      throw new Error("Database connection has not been established. Call connectToServer first.");
    }
    return database;
  }
};