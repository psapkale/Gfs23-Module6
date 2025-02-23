import express from "express";
import cors from "cors";
import scrapeIPLData from "./scraper.js";

const app = express();
const PORT = 5000;

app.use(cors());
app.get("/api/ipl-stats", async (req, res) => {
   try {
      const data = await scrapeIPLData();
      res.json(data);
   } catch (error) {
      res.status(500).json({ error: "Error fetching IPL data" });
   }
});

app.listen(PORT, () => {
   console.log(`Server running on http://localhost:${PORT}`);
});
