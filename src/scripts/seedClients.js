import mongoose from "mongoose";
import Client from "../models/client-model.js";
import clients from "../data/clients_seed.json" with { type: "json" };
import dotenv from "dotenv";

dotenv.config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    await Client.deleteMany({}); // opcional

    await Client.insertMany(clients);

    console.log("Clientes inseridos com sucesso!");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seed();