import express from "express";
import fs from "fs";
import { nanoid } from "nanoid";
import cors from "cors";

const app = express();
const apiRouter = express.Router();
const DB_FILE = "./db.json";

apiRouter.use(express.json());
apiRouter.use(cors());

const loadDB = () => {
   if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify({}));
   return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
};

const saveDB = (data) => {
   fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

apiRouter.post("/shorten", (req, res) => {
   const { url } = req.body;
   if (!url) return res.status(400).json({ error: "url not provided" });

   const db = loadDB();
   const id = nanoid(6);
   db[id] = url;
   saveDB(db);

   res.json({ shortUrl: `http://localhost:3000/${id}` });
});

apiRouter.get("/getAll", (req, res) => {
   const db = loadDB();

   res.json({
      db,
   });
});

apiRouter.get("/:id", (req, res) => {
   const db = loadDB();
   const url = db[req.params.id];
   if (!url) return res.status(404).json({ error: "Not found" });

   res.redirect(url);
});

app.use("/", apiRouter);

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
