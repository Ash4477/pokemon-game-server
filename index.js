import http from "http";
import url from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

// Connect to Local MongoDB using Mongoose
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/pokemon_data");
    console.log("✅ MongoDB Connected (Local)");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};

// Define Mongoose Schema & Model
const pokeSchema = new mongoose.Schema({
  pokeName: { type: String, required: true },
  pokeImageUrl: { type: String, required: true },
});

const Pokemon = mongoose.model("Pokemon", pokeSchema);

// Start Server After DB Connection
connectDB().then(() => {
  const server = http.createServer(async (req, res) => {
    const queryObj = url.parse(req.url, true).query;
    const limit = Number(queryObj.limit) || 5;

    try {
      const pokemonList = await Pokemon.find({})
        .limit(limit)
        .select("pokeName pokeImageUrl -_id");

      res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      });
      res.write(JSON.stringify(pokemonList));
      res.end();
    } catch (err) {
      console.error("❌ Database Query Error:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal Server Error" }));
    }
  });

  server.listen(8080, () =>
    console.log("🚀 Server running on http://localhost:8080")
  );
});
