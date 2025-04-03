import { MongoClient } from "mongodb";

export const mongoProvider = {
  provide: "MONGO_CONNECTION",
  useFactory: async () => {
    const client = new MongoClient(process.env.MONGO_URI || "mongodb://localhost:27017");
    await client.connect();
    return client.db("image_processing");
  },
};
