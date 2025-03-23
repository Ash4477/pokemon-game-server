import http from "http";
import url from "url";
import process from "process";
import mongoose, { mongo } from "mongoose";
import mongodb from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const pokeList = [
  {
    pokeName: "metapod",
    pokeImageUrl:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/11.png",
  },
  {
    pokeName: "butterfree",
    pokeImageUrl:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/12.png",
  },
  {
    pokeName: "weedle",
    pokeImageUrl:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/13.png",
  },
  {
    pokeName: "kakuna",
    pokeImageUrl:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/14.png",
  },
  {
    pokeName: "beedrill",
    pokeImageUrl:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/15.png",
  },
  {
    pokeName: "pidgey",
    pokeImageUrl:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/16.png",
  },
  {
    pokeName: "pidgeotto",
    pokeImageUrl:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/17.png",
  },
  {
    pokeName: "pidgeot",
    pokeImageUrl:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/18.png",
  },
  {
    pokeName: "rattata",
    pokeImageUrl:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/19.png",
  },
  {
    pokeName: "raticate",
    pokeImageUrl:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/20.png",
  },
];

// Connection to Mongoose
const client = new mongodb.MongoClient(process.env.MONGO_URI, {
  serverApi: {
    version: mongodb.ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectDB() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB!");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
}

await connectDB();

const db = client.db("pokemon_data");
const pokemonCollection = db.collection("pokemons");

// Server
const server = http.createServer(async (req, res) => {
  const queryObj = url.parse(req.url, true).query;
  const limit = Number(queryObj.limit) || 5;

  const pokemonList = await pokemonCollection
    .find({})
    .limit(limit)
    .project({ pokeName: 1, pokeImageUrl: 1, _id: 0 })
    .toArray();

  res.writeHead(200, {
    "content-type": "application/json",
    "access-control-allow-origin": "*",
  });
  res.write(JSON.stringify(pokemonList));
  res.end();
});

server.listen(8080, () => console.log("Server listening..."));
